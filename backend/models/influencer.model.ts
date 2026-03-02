import { Schema, model, Document } from "mongoose";

interface IInfluencer extends Document {
  name?: string;
  instagramLink: string;
  primeNiche?: string | null;
  contentKeywords?: string[] | null;
  audienceCityTier?: string[] | null;
  instagram?: {
    averageLikes?: number;
    averageComments?: number;
    averageViews?: number;
    followerCount?: number;
    followerCountString?: string;
    lastTenPostsAnalytics?: [{}];
    lastUpdated?: Date;
  } | null;
  contentRating?: 1 | 2 | 3 | 4 | 5 | null;
  Gender?: "male" | "female" | "other" | null;
  onboardDate?: Date;
  age?: number | null;
  contact?: [
    {
      type: "self" | "manager" | "agency";
      email?: string;
      phone?: string;
    },
  ] | null;
  address?: [
    {
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
      region: "urban" | "rural";
    },
  ] | null;
  plan?: {
    pricing?: "lite" | "standard" | "premium";
    renewalDate?: Date;
  } | null;
  taskStatus: "pending" | "approved";
}

const InfluencerSchema = new Schema<IInfluencer>({
  name: { type: String, default: null },
  instagramLink: { type: String, required: true },
  primeNiche: { type: String, default: null },
  contentKeywords: { type: [String], default: null },
  audienceCityTier: { type: [String], default: null },
  instagram: {
    type: new Schema(
      {
        averageLikes: { type: Number, default: 0 },
        averageComments: { type: Number, default: 0 },
        averageViews: { type: Number, default: 0 },
        averageShares: { type: Number, default: 0 },
        followerCount: { type: Number, default: 0 },
        followerCountString: { type: String, default: "0" },
        lastTenPostsAnalytics: [{type: Object}],
        lastUpdated: { type: Date, default: null },
      },
      { _id: false },
    ),
    default: null,
  },
  contentRating: { type: Number, enum: [1, 2, 3, 4, 5], default: null },
  Gender: { type: String, enum: ["male", "female", "other"], default: null },
  onboardDate: { type: Date, default: Date.now },
  age: { type: Number, default: null },
  contact: {
    type: [
      {
        type: { type: String, enum: ["self", "manager", "agency"], default: null },
        email: { type: String, default: null },
        phone: { type: String, default: null },
      },
    ],
    default: null,
  },
  address: {
    type: [
      {
        city: { type: String, default: null },
        state: { type: String, default: null },
        country: { type: String, default: null },
        zipCode: { type: String, default: null },
        region: { type: String, enum: ["urban", "rural"], default: null },
      },
    ],
    default: null,
  },
  plan: {
    pricing: { type: String, enum: ["lite", "standard", "premium"], default: null },
    renewalDate: { type: Date, default: null },
  },
  taskStatus: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
});

export const Influencer = model<IInfluencer>("Influencer", InfluencerSchema);
export default Influencer;