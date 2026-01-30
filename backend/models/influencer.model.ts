import { Schema, model, Document } from "mongoose";

interface IInfluencer extends Document {
  name: string;
  email: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  socialMedia: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  Instagram: {
    averageLikes?: number;
    averageComments?: number;
    averageViews?: number;
  };
  category: string;
  isVerified: boolean;
  rating?: number;
  location?: string;
  contactInfo: {
    phone?: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const influencerSchema = new Schema<IInfluencer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profilePicture: {
      type: String,
    },
    socialMedia: {
      instagram: String,
      youtube: String,
      tiktok: String,
      twitter: String,
    },
    Instagram: {
      averageLikes: Number,
      averageComments: Number,
      averageViews: Number,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fashion",
        "Fitness",
        "Food",
        "Travel",
        "Tech",
        "Beauty",
        "Lifestyle",
        "Gaming",
        "Other",
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    location: {
      type: String,
    },
    contactInfo: {
      phone: String,
      email: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Influencer = model<IInfluencer>("Influencer", influencerSchema);
export type { IInfluencer };
