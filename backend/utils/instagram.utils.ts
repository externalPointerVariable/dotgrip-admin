import { ApifyClient } from 'apify-client';
import { ENV } from '../config/config';

const client = new ApifyClient({
    token: ENV.APIFY_API_TOKEN,
});

export const getInstagramDetails = async (targetUsername: string) => {
    console.log(`Fetching data for @${targetUsername} via Apify...`);

    // The configuration sent to Apify
    const input = {
        usernames: [targetUsername],
        resultsLimit: 10, // <--- Change this number if you want more/less posts
    };

    try {
        // Run the Apify actor (this bypasses all Instagram login walls)
        const run = await client.actor("apify/instagram-profile-scraper").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) {
            console.log("No data found. Check the username.");
            return null;
        }

        const profileData = items[0];
        const recentPosts = profileData.latestPosts || [];
        
        // Safety check in case the user has fewer than 10 posts total
        const postsToAnalyze = recentPosts.slice(0, 10);
        const validCount = postsToAnalyze.length || 1;

        // Calculate the averages based on the extracted data
        const averageLikes = postsToAnalyze.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0) / validCount;
        const averageComments = postsToAnalyze.reduce((sum: number, post: any) => sum + (post.commentsCount || 0), 0) / validCount;
        const averageViews = postsToAnalyze.reduce((sum: number, post: any) => sum + (post.videoViewCount || 0), 0) / validCount;

        return {
            username: profileData.username,
            followerCountNumber: profileData.followersCount || 0,
            averageLikes: Math.round(averageLikes),
            averageComments: Math.round(averageComments),
            averageViews: Math.round(averageViews),
            lastTenPostsAnalytics: postsToAnalyze.map((post: any) => ({
                url: post.url,
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                views: post.videoViewCount || 0,
            }))
        };

    } catch (error) {
        console.error("Scraping failed:", error);
    }
};

// Execute the function
(async () => {
    // <--- Change the username inside the quotes to scrape someone else
    const data = await getInstagramDetails("virat.kohli"); 
    
    console.dir(data, { depth: null }); // Prints the full result to your terminal
})();