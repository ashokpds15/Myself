const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.join(__dirname, "subscribers.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified INTEGER DEFAULT 0
    )`,
    (err) => {
      if (err) console.error("Error creating table:", err);
      else console.log("Subscribers table ready");
    }
  );
}

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use Gmail App Password
  },
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log("⚠️ Email configuration issue:", error.message);
    console.log("Make sure to set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  } else {
    console.log("✓ Email service ready");
  }
});

// Routes

// Subscribe endpoint
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  db.run(
    `INSERT INTO subscribers (email) VALUES (?)`,
    [email],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ message: "Email already subscribed" });
        }
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to subscribe" });
      }

      res.status(201).json({
        message: "Successfully subscribed!",
        email: email,
      });
    }
  );
});

// Get all subscribers (Protected - requires API key)
app.get("/api/subscribers", (req, res) => {
  const apiKey = req.query.key;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  db.all(`SELECT email FROM subscribers`, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch subscribers" });
    }

    res.json({ subscribers: rows });
  });
});

// Send email to all subscribers (Protected - requires API key)
app.post("/api/notify-subscribers", (req, res) => {
  const apiKey = req.query.key;
  const { subject, htmlContent, blogTitle, blogLink } = req.body;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!subject || !htmlContent) {
    return res.status(400).json({ message: "Subject and content required" });
  }

  db.all(`SELECT email FROM subscribers`, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to fetch subscribers" });
    }

    if (rows.length === 0) {
      return res.status(200).json({ message: "No subscribers to notify" });
    }

    // Build email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 10px; text-align: center;">
          <h1>📝 New Blog Post!</h1>
          <p>Check out my latest blog post</p>
        </div>
        
        <div style="padding: 2rem; background-color: #f5f5f5;">
          <h2 style="color: #333; margin-top: 0;">${blogTitle || subject}</h2>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; line-height: 1.6;">
            ${htmlContent}
          </div>
          
          ${
            blogLink
              ? `<div style="text-align: center; margin-top: 2rem;">
                  <a href="${blogLink}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Read Full Post →
                  </a>
                </div>`
              : ""
          }
        </div>
        
        <div style="background-color: #f0f0f0; padding: 1.5rem; text-align: center; border-top: 1px solid #ddd; margin-top: 2rem;">
          <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
            You received this email because you subscribed to my blog updates.
          </p>
          <p style="color: #999; font-size: 0.85rem; margin: 0;">
            © 2024 My Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    `;

    let sent = 0;
    let failed = 0;

    rows.forEach((subscriber) => {
      transporter.sendMail(
        {
          from: process.env.GMAIL_USER,
          to: subscriber.email,
          subject: subject,
          html: emailHtml,
        },
        (err, info) => {
          if (err) {
            console.error(`Failed to send email to ${subscriber.email}:`, err);
            failed++;
          } else {
            console.log(`Email sent to ${subscriber.email}`);
            sent++;
          }

          if (sent + failed === rows.length) {
            res.status(200).json({
              message: `Emails sent successfully`,
              sent: sent,
              failed: failed,
              total: rows.length,
            });
          }
        }
      );
    });
  });
});

// Unsubscribe endpoint
app.post("/api/unsubscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  db.run(`DELETE FROM subscribers WHERE email = ?`, [email], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to unsubscribe" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({
      message: "Successfully unsubscribed",
      email: email,
    });
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications ready`);
  console.log(`Subscribe endpoint: POST /api/subscribe`);
  console.log(`Notify subscribers: POST /api/notify-subscribers?key=YOUR_API_KEY`);
});
