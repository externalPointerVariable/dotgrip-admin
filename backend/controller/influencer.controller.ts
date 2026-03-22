import { parseConfigFileTextToJson } from "typescript";
import { Influencer } from "../models/influencer.model";
import { getInstagramDetails } from "../utils/instagram.utils";
import { SheetUtil } from "../utils/sheet.utils";
import express from "express";


interface FilterQuery {
  niches?: string;
  tier?: string;
  regions?: string;
  keywords?: string;
  taskstatus?: string;
  page?: string;
  limit?: string;
}
export class InfluencerController {
  static async getAllInfluencers(req: express.Request, res: express.Response) {
    try {
      const {
        niches,
        tier,
        regions,
        keywords,
        taskstatus = "approved",
        page = "1",
        limit = "10",
      }: FilterQuery = req.query;

      const filter: any = {};

      if (niches) {
        filter.niches = niches;
      }
      if (tier) {
        filter.tier = tier;
      }
      if (regions) {
        filter.regions = regions;
      }
      if (keywords) {
        const regex = new RegExp(keywords, "i"); 
        filter.$or = [
          { name: regex },
          { description: regex },
        ];
      }
      const pageNumber: number = parseInt(page, 10);
      const limitNumber: number = parseInt(limit, 10);
      const skip: number = (pageNumber - 1) * limitNumber;

      const [Influencers, total] = await Promise.all([
        Influencer.find(filter).skip(skip).limit(limitNumber),
        Influencer.countDocuments(filter),
      ]);
      const [uniqueNiches, uniqueTiers, uniqueRegions, uniqueKeywords] = await Promise.all([
        Influencer.distinct("niches", filter),
        Influencer.distinct("tier", filter),
        Influencer.distinct("regions", filter),
        Influencer.distinct("keywords", filter),
      ]);
      res.json({
        data: Influencers,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
        uniqueFiltersValues: {
          niches: uniqueNiches,
          tiers: uniqueTiers,
          regions: uniqueRegions,
          keywords: uniqueKeywords,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPendingInfluencers (req: express.Request, res: express.Response) {
    try {
      const pendingInfluencers = await Influencer.find({ taskStatus: "pending" });
      res.json(pendingInfluencers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async influencerUpload(req: express.Request, res: express.Response) {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      const data = SheetUtil.bufferToJson(req.file.buffer);
      const results: any[] = [];
      for (const item of data) {
        const igLink = item["IG Link "]?.trim();
        if (!igLink) continue;
        const existing = await Influencer.findOne({ instagramLink: igLink });
        if (existing) {
          console.log(`Skipping ${igLink}, already exists`);
          continue;
        }
        const temp = igLink.split("?");
        const username = temp[0].split("/").filter(Boolean).pop();
        if (!username) continue;
        const influencerData = await getInstagramDetails(username);
        const finalData = {
          name: influencerData?.fullName || "Anonymous",
          instagramLink: igLink,
          instagram: {
            averageLikes: influencerData?.averageLikes || 0,
            averageComments: influencerData?.averageComments || 0,
            averageViews: influencerData?.averageViews || 0,
            followerCount: influencerData?.followerCountNumber || 0,
            followerCountString:
              influencerData?.followerCountNumber?.toLocaleString() || "0",
            lastTenPostsAnalytics: influencerData?.lastTenPostsAnalytics || [],
            lastUpdated: new Date(),
          },
          taskStatus: "pending",
        };
        const created = await Influencer.create(finalData);
        results.push(created);
      }

      res.status(200).json({
        message: "File processed successfully",
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateSingleInstagramAnalytics(
    req: express.Request,
    res: express.Response,
  ) {
    try {
      const { instagramURL } = req.body;
      const { _id } = req.body;
      if (!instagramURL) {
        return res.status(400).json({ message: "Instagram URL is required" });
      }
      const temp = instagramURL.split("?");
      const username = temp[0].split("/").filter(Boolean).pop();
      if (!username) {
        return res
          .status(400)
          .json({ message: "Invalid Instagram URL format" });
      }
      const updatedInfluencerData = await getInstagramDetails(username);
      if (!updatedInfluencerData) {
        return res.status(404).json({ message: "Instagram user not found" });
      }
      const finalData = {
        instagram: {
          averageLikes: updatedInfluencerData?.averageLikes || 0,
          averageComments: updatedInfluencerData?.averageComments || 0,
          averageViews: updatedInfluencerData?.averageViews || 0,
          followerCount: updatedInfluencerData?.followerCountNumber || 0,
          followerCountString:
            updatedInfluencerData?.followerCountNumber?.toLocaleString() || "0",
          lastTenPostsAnalytics:
            updatedInfluencerData?.lastTenPostsAnalytics || [],
          lastUpdated: new Date(),
        },
      };
      const updatedInfluencer = await Influencer.findOneAndUpdate(
        { _id: _id },
        { $set: { instagram: finalData.instagram } },
        { new: true },
      );

      if (!updatedInfluencer) {
        return res.status(404).json({ message: "Influencer not found" });
      }

      res.status(200).json({
        message: "Instagram analytics updated successfully",
        data: updatedInfluencer,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async singleInfluencer(req: express.Request, res: express.Response) {
    try {
      const influencer = await Influencer.findById(req.params.id);
      if (!influencer) {
        return res.status(404).json({ message: "Influencer not found" });
      }
      res.json(influencer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateInfluencer(req: express.Request, res: express.Response) {
    try {
      const updatedInfluencer = await Influencer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedInfluencer) {
        return res.status(404).json({ message: "Influencer not found" });
      }
      res.json(updatedInfluencer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
