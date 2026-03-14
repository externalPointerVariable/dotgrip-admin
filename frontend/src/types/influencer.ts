interface IInfluencer {
  name?: string;
  instagramLink: string;
  primeNiche?: string | null;
  contentKeywords?: string[] | null;
  audienceCityTier?: string[] | null;
  instagram?: {
    averageLikes?: number;
    averageComments?: number;
    averageViews?: number;
    averageShares?: number;
    followerCount?: number;
    followerCountString?: string;
    lastTenPostsAnalytics?: [{}];
    lastUpdated?: Date;
  } | null;
  contentRating?: 1 | 2 | 3 | 4 | 5 | null;
  Gender?: "male" | "female" | "other" | null;
  onboardDate?: Date;
  age?: number | null;
  contact?:
    | [
        {
          type: "self" | "manager" | "agency";
          email?: string;
          phone?: string;
        },
      ]
    | null;
  address?:
    | [
        {
          city?: string;
          state?: string;
          country?: string;
          zipCode?: string;
          region: "urban" | "rural";
        },
      ]
    | null;
  plan?: {
    pricing?: "lite" | "standard" | "premium";
    renewalDate?: Date;
  } | null;
  taskStatus: "pending" | "approved";
  _id: string;
}

export type Influencer = IInfluencer;
