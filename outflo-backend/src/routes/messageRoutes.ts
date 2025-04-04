import express from "express";
import {
  generatePersonalizedMessage,
  generatePersonalizedMessageFromURL,
} from "../controllers/messageController";

const router = express.Router();

router.post("/personalized-message", generatePersonalizedMessage);
router.post("/personalized-message-url", generatePersonalizedMessageFromURL);

export default router;
