import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import contactRoutes from "./contact/contact.router.js";
const app = express();
const PORT = process.env.PORT || 3000;

const info = {
    facebook: "https://www.facebook.com/nguyendungttn.97",
    github: "https://github.com/NNDung97",
    linkedin: "https://www.linkedin.com/in/dung-nguyen-38418a356"
}

// Cấu hình EJS
app.set("view engine", "ejs");

// Middleware để phục vụ file tĩnh (CSS, JS, ảnh)
app.use(express.static("public"));
app.use(cors()); // Cho phép gọi API từ frontend
app.use(bodyParser.json());

// API routes
app.use("/", contactRoutes);

// Route trang chủ
app.get("/", (req, res) => {
    res.render("index", { title: "DungNgDev",info });
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});