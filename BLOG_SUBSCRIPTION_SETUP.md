# Blog Subscription Setup Guide

This guide will help you set up the email subscription feature for your blog.

## Quick Start

### Step 1: Setup Gmail (One-time)

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Windows Computer**
3. Google generates a 16-character password
4. Copy this password (you'll need it in Step 3)

### Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_API_KEY=create_a_strong_random_key
```

Start the backend:

```bash
npm run dev
```

You should see: `🚀 Server running on http://localhost:5000`

### Step 3: Run Frontend

In a new terminal:

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`

## Testing the Subscription Form

1. Go to the **Blog** page
2. You'll see the "Subscribe to My Blog" section at the bottom
3. Enter an email address and click **Subscribe**
4. You should see a success message

## Sending Notifications to Subscribers

### Manual Method (Recommended for Now)

After publishing a new blog post, use curl to notify all subscribers:

```bash
curl -X POST "http://localhost:5000/api/notify-subscribers?key=YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "New Blog Post: Your Title",
    "blogTitle": "Your Title",
    "htmlContent": "<p>Your blog post preview or excerpt...</p>",
    "blogLink": "https://yourportfolio.com/blog/post-id"
  }'
```

Replace:
- `YOUR_ADMIN_API_KEY` with the key from your `backend/.env`
- Blog title and content with your actual blog post info
- Blog link with the actual link

### Quick Node Script

Create `backend/send-email.js`:

```javascript
const fetch = require("node-fetch");
require("dotenv").config();

async function notifySubscribers(blogTitle, content, link) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/notify-subscribers?key=${process.env.ADMIN_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Blog Post: ${blogTitle}`,
          blogTitle: blogTitle,
          htmlContent: `<p>${content}</p>`,
          blogLink: link,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Usage:
notifySubscribers(
  "My New Blog Post",
  "Check out my latest thoughts on React development",
  "https://yourportfolio.com/blog/xyz123"
);
```

Then run: `node send-email.js`

## Deployment Steps

### 1. Deploy Backend to Heroku

```bash
cd backend
npm install -g heroku
heroku login
heroku create your-unique-app-name
```

Set environment variables on Heroku:

```bash
heroku config:set GMAIL_USER=your_email@gmail.com
heroku config:set GMAIL_APP_PASSWORD=your_app_password
heroku config:set ADMIN_API_KEY=your_secret_key
```

Deploy:

```bash
git push heroku master
```

Get your backend URL from Heroku dashboard (something like `https://your-app-name.herokuapp.com`)

### 2. Update Frontend .env

Edit `.env` in your React project root:

```
REACT_APP_BACKEND_URL=https://your-app-name.herokuapp.com
```

### 3. Deploy Frontend to Cloudflare Pages

Push to GitHub and Cloudflare will auto-deploy.

## Database

- **Location**: `backend/subscribers.db`
- **Type**: SQLite (automatically created)
- **Tables**: `subscribers` (id, email, subscribed_at, verified)

To view subscribers locally:

```bash
sqlite3 backend/subscribers.db
SELECT * FROM subscribers;
.exit
```

## Troubleshooting

**Problem**: "Failed to subscribe" error when submitting form

- Check if backend is running on `http://localhost:5000`
- Check browser console (F12 → Console tab) for exact error
- Verify `.env` file exists in backend folder

**Problem**: Emails not sending

- Verify Gmail App Password is correct (check it has spaces in right places)
- Check backend logs for email errors
- Ensure your Gmail account allows "Less secure apps" or use App Passwords

**Problem**: Getting "Unauthorized" error when trying to send emails

- Verify `ADMIN_API_KEY` in `.env` matches the one in your curl command
- Make sure you added `?key=YOUR_KEY` to the API endpoint

**Problem**: Port 5000 already in use

```bash
lsof -i :5000  # Find what's using it
kill -9 <PID>  # Kill the process
```

Or change PORT in `.env` to another number like 5001

## Next Steps

1. ✅ Test subscription form works locally
2. ✅ Manually send test email to subscribers
3. ✅ Deploy backend to Heroku
4. ✅ Update frontend `.env` with production backend URL
5. ✅ Deploy frontend to Cloudflare
6. ✅ Test subscription and email sending on production

## File Structure

```
/workspaces/Myself/
├── src/
│   └── components/
│       └── Blog/
│           ├── Blog.js                 (Updated with subscription)
│           ├── BlogSubscription.js      (New - subscription form)
│           └── BlogSubscription.css     (New - styling)
├── backend/                             (New backend folder)
│   ├── server.js                        (Express server)
│   ├── package.json
│   ├── .env.example
│   ├── .env                             (Your actual env vars)
│   ├── .gitignore
│   ├── README.md
│   └── subscribers.db                   (SQLite database - auto-created)
├── .env                                 (Frontend env vars)
└── package.json
```

## Support

For issues or questions:
1. Check the backend `README.md` for detailed API documentation
2. Review error messages in browser console and backend logs
3. Test endpoints with curl commands

Good luck! 🚀
