import express from "express";
import { sendContactEmail } from "./contact.js"; // Thay require bằng import

const router = express.Router();

router.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Please fill all required fields." });
    }

    try {
        const result = await sendContactEmail(name, email, message);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;