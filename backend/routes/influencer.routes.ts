import express from "express";
import protect from "../middleware/auth.middleware";
import { upload } from "../middleware/excel.middleware";
import { InfluencerController } from "../controller/influencer.controller";

const router = express.Router();
router.use(protect);

router.get("/", InfluencerController.getAllInfluencers);
router.get("/pending-influencers/", InfluencerController.getPendingInfluencers);
router.patch(
  "/instagram-scrape/",
  InfluencerController.updateSingleInstagramAnalytics,
);
router.get("/:id", InfluencerController.singleInfluencer);
router.post(
  "/",
  upload.single("excelFile"),
  InfluencerController.influencerUpload,
);
router.put("/:id", InfluencerController.updateInfluencer);

export default router;
