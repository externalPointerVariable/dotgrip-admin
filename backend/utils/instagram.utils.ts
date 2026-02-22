import puppeteer from "puppeteer";

const followerStringToNumber = (followerString: string): number => {
  const lower = followerString.toLowerCase();
  const multiplier = lower.endsWith("k")
    ? 1000
    : lower.endsWith("m")
    ? 1000000
    : 1;
  const numberPart = parseFloat(lower.replace(/[^\d.]/g, ""));
  return Math.round(numberPart * multiplier);
};

export const getInstagramDetails = async (username: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: "networkidle2",
  });

  // Scrape profile info inside browser context
  const { followerCount, postLinks } = await page.evaluate(() => {
    const followerMeta = document.querySelector("meta[name='description']");
    const followerCount = followerMeta
      ? followerMeta.getAttribute("content") || ""
      : "";

    const postLinks = Array.from(
      document.querySelectorAll("article a")
    )
      .slice(0, 10)
      .map((a) => (a as HTMLAnchorElement).href);

    return { followerCount, postLinks };
  });

  const followerCountNumber = followerCount
    ? followerStringToNumber(followerCount.split(" ")[0])
    : 0;

  // Scrape posts one by one
  const analytics: { likes: number; comments: number; views: number }[] = [];
  for (const url of postLinks) {
    await page.goto(url, { waitUntil: "networkidle2" });
    const postData = await page.evaluate(() => {
      const likesElement = document.querySelector("section span span");
      const commentsElement = document.querySelector("ul li span");
      const viewsElement = document.querySelector("video");

      const likes = likesElement
        ? parseInt(likesElement.textContent.replace(/,/g, ""))
        : 0;
      const comments = commentsElement
        ? parseInt(commentsElement.textContent.replace(/,/g, ""))
        : 0;
      const views = viewsElement
        ? parseInt(viewsElement.getAttribute("views") || "0")
        : 0;

      return { likes, comments, views };
    });
    analytics.push(postData);
  }

  await browser.close();

  // Calculate averages
  const averageLikes =
    analytics.reduce((sum, post) => sum + post.likes, 0) / analytics.length;
  const averageComments =
    analytics.reduce((sum, post) => sum + post.comments, 0) / analytics.length;
  const averageViews =
    analytics.reduce((sum, post) => sum + post.views, 0) / analytics.length;

  return {
    followerCount,
    followerCountNumber,
    averageLikes,
    averageComments,
    averageViews,
    lastTenPostsAnalytics: analytics,
  };
};