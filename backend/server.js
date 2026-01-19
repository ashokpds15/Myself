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

    // Build email content with lots of love ❤️
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; border-radius: 15px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <h1 style="margin: 0; font-size: 2.5rem;">📝 New Blog Post!</h1>
          <p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 0.95;">Written with lots of ❤️ love for you</p>
        </div>
        
        <div style="padding: 2rem; background-color: #f9f9f9;">
          <p style="color: #666; font-size: 1rem;">Hi there! 👋</p>
          <p style="color: #666; font-size: 1rem; line-height: 1.6;">
            I've just published a new blog post that I'm excited to share with you! 
            This one is filled with insights, tips, and everything I've learned. 
            I hope you find it helpful and inspiring. ✨
          </p>
          
          <h2 style="color: #333; margin: 2rem 0 1rem 0; border-left: 4px solid #667eea; padding-left: 1rem;">${blogTitle || subject}</h2>
          <div style="background: white; padding: 1.5rem; border-radius: 8px; line-height: 1.8; color: #444;">
            ${htmlContent}
          </div>
          
          ${
            blogLink
              ? `<div style="text-align: center; margin-top: 2rem;">
                  <a href="${blogLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 1.05rem; transition: transform 0.3s ease;">
                    Read Full Post →
                  </a>
                </div>`
              : ""
          }
        </div>
        
        <div style="background-color: #f0f0f0; padding: 2rem; text-align: center; border-top: 2px solid #ddd; margin-top: 2rem; border-radius: 0 0 15px 15px;">
          <p style="color: #666; font-size: 1rem; margin: 0.5rem 0;">
            <strong>Thank you for being here!</strong> 🙏
          </p>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0;">
            Your support means everything to me. Every read, every comment, 
            every share—it all matters. I write these posts with you in mind, 
            hoping they make a positive impact on your journey.
          </p>
          <p style="color: #999; font-size: 0.85rem; margin: 1.5rem 0 0 0;">
            Sent with lots of ❤️ love<br>
            © 2024 My Blog. All rights reserved.
          </p>
          <p style="color: #999; font-size: 0.8rem; margin: 1rem 0 0 0;">
            <a href="https://yourportfolio.com/unsubscribe" style="color: #999; text-decoration: none;">Unsubscribe</a> | 
            <a href="https://yourportfolio.com/blog" style="color: #999; text-decoration: none;">View All Posts</a>
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

// Auto-send notification for latest blog post (Protected - requires API key)
app.post("/api/auto-notify-latest-blog", (req, res) => {
  const apiKey = req.query.key;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const BLOGGER_API_KEY = "AIzaSyCI9xZXzwPvx4bICIctsnTbxk9mfzIWNsY";
  const BLOG_ID = "3800019340026834324";

  // Fetch latest blog post from Blogger
  fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=1&orderBy=published`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ message: "No blog posts found" });
      }

      const latestPost = data.items[0];
      const blogTitle = latestPost.title;
      const blogContent = latestPost.content.substring(0, 300) + "...";
      const blogLink = latestPost.url;
      const subject = `New Blog Post: ${blogTitle}`;

      db.all(`SELECT email FROM subscribers`, [], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to fetch subscribers" });
        }

        if (rows.length === 0) {
          return res.status(200).json({ message: "No subscribers to notify" });
        }

        // Build email with love message
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 2rem; border-radius: 15px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <h1 style="margin: 0; font-size: 2.5rem;">📝 New Blog Post!</h1>
              <p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 0.95;">Written with lots of ❤️ love for you</p>
            </div>
            
            <div style="padding: 2rem; background-color: #f9f9f9;">
              <p style="color: #666; font-size: 1rem;">Hi there! 👋</p>
              <p style="color: #666; font-size: 1rem; line-height: 1.6;">
                I've just published a new blog post that I'm excited to share with you! 
                This one is filled with insights, tips, and everything I've learned. 
                I hope you find it helpful and inspiring. ✨
              </p>
              
              <h2 style="color: #333; margin: 2rem 0 1rem 0; border-left: 4px solid #667eea; padding-left: 1rem;">${blogTitle}</h2>
              <div style="background: white; padding: 1.5rem; border-radius: 8px; line-height: 1.8; color: #444;">
                ${blogContent}
              </div>
              
              <div style="text-align: center; margin-top: 2rem;">
                <a href="${blogLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 1.05rem;">
                  Read Full Post →
                </a>
              </div>
            </div>
            
            <div style="background-color: #f0f0f0; padding: 2rem; text-align: center; border-top: 2px solid #ddd; margin-top: 2rem; border-radius: 0 0 15px 15px;">
              <p style="color: #666; font-size: 1rem; margin: 0.5rem 0;">
                <strong>Thank you for being here!</strong> 🙏
              </p>
              <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0;">
                Your support means everything to me. Every read, every comment, 
                every share—it all matters. I write these posts with you in mind, 
                hoping they make a positive impact on your journey.
              </p>
              <p style="color: #999; font-size: 0.85rem; margin: 1.5rem 0 0 0;">
                Sent with lots of ❤️ love<br>
                © 2024 My Blog. All rights reserved.
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
                  message: `Auto-notification sent successfully`,
                  blogTitle: blogTitle,
                  sent: sent,
                  failed: failed,
                  total: rows.length,
                });
              }
            }
          );
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
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
