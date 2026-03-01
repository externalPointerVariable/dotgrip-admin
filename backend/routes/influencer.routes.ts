import express from "express";
import { Influencer } from "../models/influencer.model";
import protect from "../middleware/auth.middleware";
import { getInstagramDetails } from "../utils/instagram.utils";

const router = express.Router();
router.use(protect);

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const influencers = await Influencer.find();
    res.json(influencers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/instagram-scrape/:username", async (req: express.Request, res: express.Response) => {
  try {
    const details = await getInstagramDetails(req.params.username);
    res.json(details);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }
    res.json(influencer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", async (req: express.Request, res: express.Response) => {
  const influencer = new Influencer(req.body);
  try {
    const newInfluencer = await influencer.save();
    res.status(201).json(newInfluencer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req: express.Request, res: express.Response) => {
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
});
export default router;
