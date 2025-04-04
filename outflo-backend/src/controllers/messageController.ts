import { Request, Response } from "express";
import generateMessage from "../utils/geminiAPI";
import scrapeLinkedInProfile from "../utils/linkedinScraper";

export const generatePersonalizedMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, job_title, company, location, summary } = req.body;
    console.log("Received data:", {
      name,
      job_title,
      company,
      location,
      summary,
    });

    const prompt = `Generate a personalized cold outreach message to ${name}, a ${job_title} at ${company} located in ${location}.
    Their summary is: ${summary}. Focus on their experience and suggest a connection. Keep it short and engaging.`;

    console.log("Generating message with prompt:", prompt);
    const generatedMessage = await generateMessage(prompt);
    console.log("Generated message:", generatedMessage);

    res.json({ message: generatedMessage });
  } catch (error: any) {
    console.error("Error generating personalized message:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate message" });
  }
};

export const generatePersonalizedMessageFromURL = async (
  req: Request,
  res: Response
) => {
  try {
    const { linkedinUrl } = req.body;

    // Validate URL
    if (!linkedinUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL is required",
      });
    }

    // Validate URL format
    const urlPattern =
      /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/in\/[\w\-\_]+\/?$/;
    if (!urlPattern.test(linkedinUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL format",
      });
    }

    console.log("Processing LinkedIn URL:", linkedinUrl);

    const profileData = await scrapeLinkedInProfile(linkedinUrl);
    console.log("LinkedIn profile data:", profileData);

    if (
      !profileData.name ||
      !profileData.job_title ||
      !profileData.company ||
      !profileData.location ||
      !profileData.summary
    ) {
      console.log("Incomplete profile data:", profileData);
      return res.status(400).json({
        message:
          "Could not extract all required data from LinkedIn profile. Please check the URL and try again.",
        ...profileData,
      });
    }

    const { name, job_title, company, location, summary } = profileData;

    const prompt = `Generate a personalized cold outreach message to ${name}, a ${job_title} at ${company} located in ${location}.
          Their summary is: ${summary}. Focus on their experience and suggest a connection. Keep it short and engaging.`;

    console.log("Generating message with prompt:", prompt);
    const generatedMessage = await generateMessage(prompt);
    console.log("Generated message:", generatedMessage);

    res.json({
      ...profileData,
      message: generatedMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
