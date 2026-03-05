import React from "react";

const dummyInfluencer = {
  name: "Jane Doe",
  instagramLink: "https://instagram.com/janedoe",
  primeNiche: "Fashion",
  contentKeywords: ["style", "outfit", "trends"],
  audienceCityTier: ["Tier 1", "Tier 2"],
  instagram: {
    averageLikes: 1200,
    averageComments: 150,
    averageViews: 5000,
    averageShares: 50,
    followerCount: 25000,
    followerCountString: "25K",
    lastTenPostsAnalytics: [
      { likes: 1000, comments: 120 },
      { likes: 1300, comments: 180 },
    ],
    lastUpdated: "2026-03-01",
  },
  contentRating: 4,
  Gender: "female",
  onboardDate: "2025-12-01",
  age: 27,
  contact: [
    { type: "self", email: "jane@example.com", phone: "+1234567890" },
    { type: "manager", email: "manager@example.com", phone: "+0987654321" },
  ],
  address: [
    {
      city: "Mumbai",
      state: "MH",
      country: "India",
      zipCode: "400001",
      region: "urban",
    },
  ],
  plan: {
    pricing: "premium",
    renewalDate: "2026-12-01",
  },
  taskStatus: "approved",
};

const InfluencerProfile = () => {
  const inf = dummyInfluencer;
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Influencer Profile</h2>
      <div>
        <strong>Name:</strong> {inf.name}
      </div>
      <div>
        <strong>Instagram Link:</strong>{" "}
        <a href={inf.instagramLink} target="_blank" rel="noopener noreferrer">
          {inf.instagramLink}
        </a>
      </div>
      <div>
        <strong>Prime Niche:</strong> {inf.primeNiche}
      </div>
      <div>
        <strong>Content Keywords:</strong> {inf.contentKeywords?.join(", ")}
      </div>
      <div>
        <strong>Audience City Tier:</strong> {inf.audienceCityTier?.join(", ")}
      </div>
      <div>
        <strong>Instagram Analytics:</strong>
        <ul>
          <li>Average Likes: {inf.instagram?.averageLikes}</li>
          <li>Average Comments: {inf.instagram?.averageComments}</li>
          <li>Average Views: {inf.instagram?.averageViews}</li>
          <li>Average Shares: {inf.instagram?.averageShares}</li>
          <li>
            Follower Count: {inf.instagram?.followerCountString} (
            {inf.instagram?.followerCount})
          </li>
          <li>Last Updated: {inf.instagram?.lastUpdated?.toString()}</li>
          <li>
            Last Ten Posts Analytics:
            <ul>
              {inf.instagram?.lastTenPostsAnalytics?.map((post, idx) => (
                <li key={idx}>
                  Post {idx + 1}: Likes: {post.likes ?? "-"}, Comments:{" "}
                  {post.comments ?? "-"}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <strong>Content Rating:</strong> {inf.contentRating}
      </div>
      <div>
        <strong>Gender:</strong> {inf.Gender}
      </div>
      <div>
        <strong>Onboard Date:</strong> {inf.onboardDate?.toString()}
      </div>
      <div>
        <strong>Age:</strong> {inf.age}
      </div>
      <div>
        <strong>Contact:</strong>
        <ul>
          {inf.contact?.map((c, idx) => (
            <li key={idx}>
              {c.type}: {c.email} / {c.phone}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Address:</strong>
        <ul>
          {inf.address?.map((a, idx) => (
            <li key={idx}>
              {a.city}, {a.state}, {a.country}, {a.zipCode} ({a.region})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Plan:</strong> {inf.plan?.pricing} (Renewal:{" "}
        {inf.plan?.renewalDate?.toString()})
      </div>
      <div>
        <strong>Task Status:</strong> {inf.taskStatus}
      </div>
    </div>
  );
};

export default InfluencerProfile;
