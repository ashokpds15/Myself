#!/usr/bin/env node

/**
 * Auto-notify subscribers about latest blog post
 * Usage: node auto-send-latest-blog.js
 */

require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
  console.error("❌ Error: ADMIN_API_KEY not set in .env");
  process.exit(1);
}

async function sendNotification() {
  try {
    console.log("📧 Fetching latest blog post and sending notifications...\n");

    const response = await fetch(
      `${BACKEND_URL}/api/auto-notify-latest-blog`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": ADMIN_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!");
      console.log(`📝 Blog Title: ${data.blogTitle}`);
      console.log(`📤 Emails Sent: ${data.sent}/${data.total}`);
      if (data.failed > 0) {
        console.log(`⚠️  Failed: ${data.failed}`);
      }
      console.log("\n💌 All subscribers notified with lots of ❤️ love!\n");
    } else {
      console.error("❌ Error:", data.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Failed to send notifications:", error.message);
    process.exit(1);
  }
}

sendNotification();
