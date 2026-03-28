import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(name, email, message) {
  console.log("🔹 Resend API Key:", process.env.RESEND_API_KEY ? "Loaded" : "Not Loaded");

  try {
    const response = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", 
      to: process.env.EMAIL_USER, // email nhận
      subject: `New Contact Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      reply_to: email, //reply trả lời user
    });

    if (response.error) {
      console.error("❌ Resend Error:", response.error);
      return {
        success: false,
        message: "Failed to send email.",
        error: response.error,
      };
    }

    console.log("✅ Email sent:", response.data);
    return {
      success: true,
      message: "Email sent successfully!",
    };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email.",
      error: error.message,
    };
  }
}