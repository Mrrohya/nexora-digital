const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static HTML/CSS/JS
app.use(express.static(path.join(__dirname, "..")));

// Optional nice URLs
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "getstarted.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "..", "contact.html")));
app.get("/services", (req, res) => res.sendFile(path.join(__dirname, "..", "services.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "..", "about.html")));

// Contact form POST
app.post("/contact", async (req, res) => {
  const { name, email, service, message } = req.body;
  console.log("Data received:", req.body);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Lead from Nexora Digital",
      html: `<h2>New Inquiry</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Service:</strong> ${service}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));