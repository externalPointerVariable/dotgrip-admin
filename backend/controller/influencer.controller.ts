import { get } from "mongoose";
import { Influencer } from "../models/influencer.model";
import { getInstagramDetails } from "../utils/instagram.utils";
import { SheetUtil } from "../utils/sheet.utils";
import express from "express";
import {multer} from "multer";

export class InfluencerController {
    static async getAllInfluencers(req: express.Request, res: express.Response) {
        try {
            const influencers = await Influencer.find();
            res.json(influencers);
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

        // ✅ Use the new bufferToJson method
        const data = SheetUtil.bufferToJson(req.file.buffer);

        res.status(200).json({ message: "File processed successfully", data });
        } catch (error: any) {
        res.status(500).json({ message: error.message });
        }
    }


    static async updateSingleInstagramAnalytics(req: express.Request, res: express.Response) {
        try{
            const updatedInfluencer = await getInstagramDetails(req.params.username);
            res.status(200).json(updatedInfluencer);
        }catch (error: any) {
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