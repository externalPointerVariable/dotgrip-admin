import pkg from "express";
const { Router, Request, Response } = pkg;
import Influencer from "../models/influencer.model.ts";

const router = Router();

// POST - Test creating an influencer
router.post("/test-influencer", async (req: Request, res: Response) => {
  try {
    const testInfluencer = new Influencer(req.body);
    const savedInfluencer = await testInfluencer.save();

    res.status(201).json({
      success: true,
      message: "Influencer created successfully",
      data: savedInfluencer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating influencer",
      error: error.message,
    });
  }
});

// GET - Retrieve all influencers to verify
router.get("/test-influencer", async (req: Request, res: Response) => {
  try {
    const influencers = await Influencer.find();
    res.status(200).json({
      success: true,
      count: influencers.length,
      data: influencers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching influencers",
      error: error.message,
    });
  }
});

export default router;
