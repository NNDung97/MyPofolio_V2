import express from "express";
import { sendContactEmail } from "./contact.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // ✅ Validate input
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Please fill all required fields.",
    });
  }

  // (optional) validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format.",
    });
  }

  try {
    const result = await sendContactEmail(name, email, message);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    }

    console.error("❌ Send mail failed:", result.error);

    return res.status(500).json({
      success: false,
      error: result.message,
    });

  } catch (error) {
    console.error("❌ Internal error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;