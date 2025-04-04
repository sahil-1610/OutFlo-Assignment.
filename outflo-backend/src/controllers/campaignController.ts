import { Request, Response } from "express";
import Campaign, { CampaignStatus, ICampaign } from "../models/Campaign";
import mongoose from "mongoose";

// GET /campaigns
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    console.log("[GET] /campaigns - Fetching all campaigns");
    const campaigns = await Campaign.find({
      status: { $ne: CampaignStatus.DELETED },
    });
    console.log(`[GET] /campaigns - Found ${campaigns.length} campaigns`);
    res.json(campaigns);
  } catch (error) {
    console.error("[GET] /campaigns - Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET /campaigns/:id
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    console.log(`[GET] /campaigns/${req.params.id} - Fetching campaign`);
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === CampaignStatus.DELETED) {
      console.log(`[GET] /campaigns/${req.params.id} - Campaign not found`);
      return res.status(404).json({ message: "Campaign not found" });
    }
    console.log(
      `[GET] /campaigns/${req.params.id} - Campaign found:`,
      campaign
    );
    res.json(campaign);
  } catch (error) {
    console.error(`[GET] /campaigns/${req.params.id} - Error:`, error);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /campaigns
export const createCampaign = async (req: Request, res: Response) => {
  try {
    console.log("[POST] /campaigns - Creating new campaign", req.body);
    const { name, description, status, linkedInUrls, accountIds } = req.body;

    if (status && !Object.values(CampaignStatus).includes(status)) {
      console.log("[POST] /campaigns - Invalid status value:", status);
      return res.status(400).json({ message: "Invalid status value" });
    }

    const newCampaign = new Campaign({
      name,
      description,
      status,
      linkedInUrls: linkedInUrls || [],
      accountIds: accountIds || [],
      leadsCount: accountIds?.length || 0, // Set initial leadsCount based on accountIds
    });

    console.log(
      "[POST] /campaigns - Initial leadsCount:",
      newCampaign.leadsCount
    );
    const campaign = await newCampaign.save();
    console.log(
      "[POST] /campaigns - Campaign created with leadsCount:",
      campaign.leadsCount
    );
    res.status(201).json(campaign);
  } catch (error) {
    console.error("[POST] /campaigns - Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /campaigns/:id
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    console.log(
      `[PUT] /campaigns/${req.params.id} - Updating campaign:`,
      req.body
    );
    const { name, description, status, linkedInUrls, accountIds } = req.body;

    if (status && !Object.values(CampaignStatus).includes(status)) {
      console.log(
        `[PUT] /campaigns/${req.params.id} - Invalid status value:`,
        status
      );
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = {
      name,
      description,
      status,
      linkedInUrls: linkedInUrls || [],
      accountIds: accountIds || [],
      leadsCount: accountIds?.length || 0, // Update leadsCount based on accountIds
    };

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!campaign) {
      console.log(`[PUT] /campaigns/${req.params.id} - Campaign not found`);
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log(
      `[PUT] /campaigns/${req.params.id} - Campaign updated:`,
      campaign
    );
    res.json(campaign);
  } catch (error) {
    console.error(`[PUT] /campaigns/${req.params.id} - Error:`, error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /campaigns/:id (soft delete)
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    console.log(
      `[DELETE] /campaigns/${req.params.id} - Soft deleting campaign`
    );
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: CampaignStatus.DELETED },
      { new: true }
    );

    if (!campaign) {
      console.log(`[DELETE] /campaigns/${req.params.id} - Campaign not found`);
      return res.status(404).json({ message: "Campaign not found" });
    }

    console.log(
      `[DELETE] /campaigns/${req.params.id} - Campaign deleted:`,
      campaign
    );
    res.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error(`[DELETE] /campaigns/${req.params.id} - Error:`, error);
    res.status(500).json({ message: "Server Error" });
  }
};
