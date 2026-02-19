import express from "express";
import { Influencer } from "../models/influencer.model";

const router = express.Router();

const authorize = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.role == "admin") next();
  res.status(403).json({ message: "Access denied" });
};

router.use(authorize);

router.get("/", async (req, res) => {
  try {
    const influencers = await Influencer.find();
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  const influencer = new Influencer(req.body);
  try {
    const newInfluencer = await influencer.save();
    res.status(201).json(newInfluencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
