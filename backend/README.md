# Blog Subscription Backend

This is the backend server for blog email subscriptions in your portfolio.

## Features

- ✉️ Subscribe to blog updates via email form
- 📧 Gmail SMTP integration for sending emails
- 💾 SQLite database for storing subscriber emails
- 🔐 Admin API endpoints (protected with API key)
- 🚀 Easy deployment to Heroku, Vercel, or your own server

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Gmail SMTP

To use Gmail for sending emails, you need to:

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Windows Computer** (or your device)
3. Google will generate a 16-character app password
4. Copy this password

### 3. Create .env file

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_API_KEY=your_super_secret_key_here
```

### 4. Run Locally

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Subscribe to Blog

**POST** `/api/subscribe`

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "message": "Successfully subscribed!",
  "email": "user@example.com"
}
```

### Get All Subscribers (Admin Only)

**GET** `/api/subscribers?key=YOUR_ADMIN_API_KEY`

Response:

```json
{
  "subscribers": [
    { "email": "user1@example.com" },
    { "email": "user2@example.com" }
  ]
}
```

### Send Notification to All Subscribers (Admin Only)

**POST** `/api/notify-subscribers?key=YOUR_ADMIN_API_KEY`

```json
{
  "subject": "New Blog Post!",
  "blogTitle": "My Latest Blog Post",
  "htmlContent": "<p>This is my new blog post content...</p>",
  "blogLink": "https://yourportfolio.com/blog/post-id"
}
```

Response:

```json
{
  "message": "Emails sent successfully",
  "sent": 5,
  "failed": 0,
  "total": 5
}
```

### Unsubscribe

**POST** `/api/unsubscribe`

```json
{
  "email": "user@example.com"
}
```

### Health Check

**GET** `/api/health`

## Deployment

### Option 1: Deploy to Heroku (Recommended)

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Run:

```bash
heroku login
cd backend
heroku create your-app-name
heroku config:set GMAIL_USER=your_email@gmail.com
heroku config:set GMAIL_APP_PASSWORD=your_app_password
heroku config:set ADMIN_API_KEY=your_secret_key
git push heroku master
```

### Option 2: Deploy to Vercel

Vercel doesn't support persistent databases for free tier. Consider Heroku or Railway.

### Option 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy

### Option 4: Self-Hosted (VPS/Linux Server)

1. SSH into your server
2. Clone repo and install dependencies
3. Use PM2 to keep server running:

```bash
npm install -g pm2
pm2 start server.js --name "portfolio-backend"
pm2 startup
pm2 save
```

4. Setup Nginx as reverse proxy
5. Setup SSL with Let's Encrypt

## Frontend Configuration

In your React app (`.env` or in code), set the backend URL:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

For local development:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## How to Send Emails to Subscribers

### Method 1: Manual (After Publishing Blog Post)

Make a POST request to your backend:

```bash
curl -X POST "https://your-backend-url.com/api/notify-subscribers?key=YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "New Blog Post: How to Learn React",
    "blogTitle": "How to Learn React",
    "htmlContent": "<p>I just published a new blog post about React...</p>",
    "blogLink": "https://yourportfolio.com/blog/post-id"
  }'
```

### Method 2: Automated (Using IFTTT/Zapier)

1. Set up IFTTT or Zapier
2. Trigger: When new blog post published (Blogger webhook)
3. Action: Call your `/api/notify-subscribers` endpoint

### Method 3: Admin Dashboard

Create an admin panel in your portfolio to:

1. View all subscribers
2. Send custom emails
3. View email sending history

## Troubleshooting

**Issue: "Invalid login credentials" error**

- Make sure you're using Gmail App Password, not your regular password
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct in `.env`

**Issue: "EADDRINUSE: address already in use :::5000"**

- Port 5000 is already in use. Either:
  - Stop the process using port 5000: `lsof -i :5000` then `kill -9 <PID>`
  - Change PORT in `.env` to something else like 5001

**Issue: Subscribers not receiving emails**

- Check Gmail spam folder
- Verify `GMAIL_USER` matches the email configured
- Check backend logs for errors

**Issue: Database errors**

- Delete `subscribers.db` file and restart server to reinitialize database
- Make sure `backend` folder has write permissions

## Security Best Practices

1. ✅ Use environment variables for sensitive data
2. ✅ Protect admin endpoints with strong API key
3. ✅ Validate email format on both frontend and backend
4. ✅ Use HTTPS in production
5. ✅ Add rate limiting to prevent spam
6. ✅ Consider adding email verification (optional)

## License

This code is part of your portfolio project.
