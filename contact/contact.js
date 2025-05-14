import nodemailer from "nodemailer";

export async function sendContactEmail(name, email, message) {
        console.log("🔹 Email User:", process.env.EMAIL_USER);
        console.log("🔹 Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            transporter.verify((error, success) => {
                if (error) {
                    console.error("❌ SMTP Connection Failed:", error);
                } else {
                    console.log("✅ SMTP Connection Successful!");
                }
            });
                const mailOptions = {
                from: email,
                to: process.env.EMAIL_USER,
                subject: `New Contact Request from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            };

            try {
                await transporter.sendMail(mailOptions);
                return { success: true, message: "Email sent successfully!" };
            } catch (error) {
                return { success: false, message: "Failed to send email.", error };
            }
        } catch (error) {
            console.error("❌ Error sending email:", error);
            return { success: false, message: "Failed to send email.", error: error.message };
        }
    // console.log("🔹 Email User:", process.env.EMAIL_USER);
    // console.log("🔹 Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");
    // console.log("🔹 Nodemailer config:", transporter.options);

    // const mailOptions = {
    //     from: email,
    //     to: process.env.EMAIL_USER,
    //     subject: `New Contact Request from ${name}`,
    //     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    // };

    // try {
    //     await transporter.sendMail(mailOptions);
    //     return { success: true, message: "Email sent successfully!" };
    // } catch (error) {
    //     return { success: false, message: "Failed to send email.", error };
    // }
}