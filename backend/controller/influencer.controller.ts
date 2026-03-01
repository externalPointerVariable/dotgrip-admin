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
        try{
            const file = req.file.path;
            if (!file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
                   }catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}