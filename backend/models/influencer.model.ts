import { Schema, model, Document } from "mongoose";

interface IInfluencer extends Document {
  name: string;
  instagramLink: string;
  primeNiche: string;
  contentKeywords?: string[];
  audienceCityTier?: string[];
  instagram?: {
    averageLikes?: number;
    averageComments?: number;
    averageViews?: number;
    averageShares?: number;
    followerCount?: number;
    followerCountString?: string;
    lastUpdated?: Date;
  } | null;
  contentRating: 1 | 2 | 3 | 4 | 5;
  Gender: "male" | "female" | "other";
  onboardDate: Date;
  age?: number;
  contact: [
    {
      type: "self" | "manager" | "agency";
      email?: string;
      phone?: string;
    },
  ];
  address?: [
    {
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
      region: "urban" | "rural";
    },
  ];
  plan: {
    pricing: "lite" | "standard" | "premium";
    renewalDate: Date;
  };
  taskStatus: "pending" | "approved";
}

const InfluencerSchema = new Schema<IInfluencer>({
  name: { type: String, required: true },
  instagramLink: { type: String, required: true },
  primeNiche: { type: String, required: true },
  contentKeywords: { type: [String], required: true },
  audienceCityTier: { type: [String], required: true },
  instagram: {
    type: new Schema(
      {
        averageLikes: { type: Number },
        averageComments: { type: Number },
        averageViews: { type: Number },
        averageShares: { type: Number },
        followerCount: { type: Number },
        followerCountString: { type: String },
        lastUpdated: { type: Date },
      },
      { _id: false },
    ),
    default: null,
  },
  contentRating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  Gender: { type: String, enum: ["male", "female", "other"], required: true },
  onboardDate: { type: Date, default: Date.now },
  age: { type: Number, required: true },
  contact: [
    {
      type: {
        type: String,
        enum: ["self", "manager", "agency"],
        required: true,
      },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
  ],
  address: [
    {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      region: { type: String, enum: ["urban", "rural"], required: true },
    },
  ],
  plan: {
    pricing: {
      type: String,
      enum: ["lite", "standard", "premium"],
      required: true,
    },
    renewalDate: { type: Date, required: true },
  },
  taskStatus: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
});

export const Influencer = model<IInfluencer>("Influencer", InfluencerSchema);
