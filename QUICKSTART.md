# 🚀 Quick Start Guide

## The Problem You're Seeing

When you run `npm run dev` and visit `http://localhost:5173/`, the page keeps loading because **the app is not configured yet**. You need to set up two things:

1. **Firebase** (for saving your scripts history)
2. **OpenRouter API** (for AI to generate scripts)

## ✅ Step 1: Install Dependencies (Already Done!)

```bash
npm install
```

## 🔥 Step 2: Set Up Firebase (5 minutes)

### A. Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click **"Create a project"** (or "Add project")
3. Name it: `video-script-generator`
4. Click **"Continue"** → Disable Google Analytics → **"Create project"**

### B. Enable Firestore Database

1. In left sidebar → Click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (easier for testing)
4. Select location (any region close to you)
5. Click **"Enable"**

### C. Get Your Firebase Credentials

1. Click the **⚙️ gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **`</>`** web icon
4. Enter nickname: `video-script-app`
5. Click **"Register app"**
6. You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC3xBcDeFgHiJkLmNoPqRsTuVwXyZ123AB",
  authDomain: "video-scripts-xyz.firebaseapp.com",
  projectId: "video-scripts-xyz",
  storageBucket: "video-scripts-xyz.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abc123def456"
};
```

### D. Update Your Code

Open `src/config/firebaseConfig.js` and replace the placeholder values with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC3xBcDeFgHiJkLmNoPqRsTuVwXyZ123AB", // ← Your real value
  authDomain: "video-scripts-xyz.firebaseapp.com",    // ← Your real value
  projectId: "video-scripts-xyz",                     // ← Your real value
  storageBucket: "video-scripts-xyz.appspot.com",     // ← Your real value
  messagingSenderId: "987654321098",                   // ← Your real value
  appId: "1:987654321098:web:abc123def456"            // ← Your real value
};
```

## 🤖 Step 3: Set Up OpenRouter API (3 minutes)

### A. Create Account & Get API Key

1. Go to: https://openrouter.ai/
2. Click **"Sign In"** (use Google/GitHub/Email)
3. Go to: https://openrouter.ai/keys
4. Click **"Create Key"**
5. Name it: `Video Script Generator`
6. **Copy the key** (starts with `sk-or-v1-`)
   - ⚠️ You won't see it again, so save it now!

### B. Add Credits

1. Go to: https://openrouter.ai/credits
2. Click **"Add Credits"**
3. Add at least **$5** (enough for hundreds of scripts)
4. Complete payment

### C. Update Your Code

Open `src/config/openRouterConfig.js` and replace the API key:

```javascript
export const OPENROUTER_CONFIG = {
  apiKey: "sk-or-v1-abc123def456ghi789jkl...", // ← Paste your real API key here
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "anthropic/claude-3.5-sonnet",
  // ... rest stays the same
};
```

## 🎉 Step 4: Run The App

```bash
npm run dev
```

Open your browser: **http://localhost:5173/**

The app should now load properly! 🎬

## 🧪 Test It

1. Enter a video idea in Arabic (e.g., "أفكار لتزيين المنزل")
2. Set number of scripts: 2
3. Click "إنشاء السكريبتات"
4. Wait a few seconds
5. You should see 2 generated scripts!

## ❌ Still Not Working?

### Check Browser Console

Open browser console (F12 or Right-click → Inspect → Console)

Look for messages:
- ✅ **"Firebase initialized successfully"** - Good!
- ⚠️ **"Firebase not configured"** - Go back to Step 2
- ⚠️ **"OpenRouter API key not configured"** - Go back to Step 3

### Common Issues

1. **Page still loading forever**
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Make sure you saved the config files
   - Restart the dev server (Ctrl+C, then `npm run dev` again)

2. **"Firebase initialization failed"**
   - Double-check your Firebase credentials
   - Make sure you copied them exactly (no extra spaces)

3. **Scripts generation fails**
   - Check if you added credits to OpenRouter
   - Verify your API key is correct
   - Check browser console for error messages

## 📁 File Locations

- Firebase config: `src/config/firebaseConfig.js`
- OpenRouter config: `src/config/openRouterConfig.js`
- Full setup guide: `SETUP_INSTRUCTIONS.md`

## 🆘 Need More Help?

See the detailed guide: `SETUP_INSTRUCTIONS.md`

Or check the README: `README.md`

---

**That's it! You're ready to generate amazing video scripts! 🎬✨**

