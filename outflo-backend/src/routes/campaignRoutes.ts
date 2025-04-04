import express from "express";
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", createCampaign);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
