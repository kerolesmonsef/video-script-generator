# 🚀 Setup Instructions

Complete step-by-step guide to get your Video Script Generator up and running.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js v16 or higher** - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **A Firebase account** - [Sign up here](https://firebase.google.com/)
- ✅ **An OpenRouter account** - [Sign up here](https://openrouter.ai/)
- ✅ **A code editor** (VS Code recommended)

## 🎯 Step-by-Step Setup

### Step 1: Project Setup

Navigate to the project directory and install dependencies:

```bash
cd /var/www/html/video-script-generator
npm install
```

Or use the automated setup script:

```bash
./setup.sh
```

### Step 2: Firebase Configuration

#### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter a project name (e.g., "video-script-generator")
4. Click **"Continue"**
5. Disable Google Analytics (optional) or configure it
6. Click **"Create project"**
7. Wait for the project to be created
8. Click **"Continue"**

#### B. Enable Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - Test mode allows read/write without authentication
   - You can change this later for production
4. Click **"Next"**
5. Choose a location (closest to your target audience)
6. Click **"Enable"**
7. Wait for Firestore to be initialized

#### C. Get Firebase Credentials

1. Click the **gear icon ⚙️** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>`
5. Enter an app nickname (e.g., "video-script-app")
6. **DON'T** check "Firebase Hosting" (optional)
7. Click **"Register app"**
8. Copy the `firebaseConfig` object shown

#### D. Update Firebase Configuration

Open `src/config/firebaseConfig.js` and replace the values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Example with real values:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC3xBcDeFgHiJkLmNoPqRsTuVwXyZ123AB",
  authDomain: "video-scripts-2024.firebaseapp.com",
  projectId: "video-scripts-2024",
  storageBucket: "video-scripts-2024.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abc123def456ghi789"
};
```

### Step 3: OpenRouter Configuration

#### A. Create OpenRouter Account

1. Go to [OpenRouter](https://openrouter.ai/)
2. Click **"Sign In"** (top right)
3. Sign in with Google, GitHub, or Email
4. Verify your email if required

#### B. Get API Key

1. After signing in, go to [API Keys](https://openrouter.ai/keys)
2. Click **"Create Key"**
3. Give it a name (e.g., "Video Script Generator")
4. Click **"Create"**
5. **Copy the API key immediately** (you won't see it again!)
   - It starts with `sk-or-v1-`
6. Save it somewhere safe

#### C. Add Credits

1. Go to [Credits](https://openrouter.ai/credits)
2. Click **"Add Credits"**
3. Add at least **$5** to start
   - This is enough for hundreds of script generations
4. Complete the payment

#### D. Update OpenRouter Configuration

Open `src/config/openRouterConfig.js` and replace the API key:

```javascript
export const OPENROUTER_CONFIG = {
  apiKey: "sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your actual API key
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "anthropic/claude-3.5-sonnet",
  
  models: [
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (موصى به)" },
    { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "google/gemini-pro", name: "Gemini Pro" },
    { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" }
  ]
};
```

**Example with real API key:**
```javascript
export const OPENROUTER_CONFIG = {
  apiKey: "sk-or-v1-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  // ...rest of config
};
```

### Step 4: Test the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to: `http://localhost:5173`
   - You should see the application interface

3. **Test script generation:**
   - Enter a video idea (in Arabic)
   - Set number of scripts (e.g., 2)
   - Click "إنشاء السكريبتات"
   - Wait for the scripts to generate
   - Verify they appear on screen

4. **Test Firebase saving:**
   - After generating scripts, check Firebase Console
   - Go to Firestore Database
   - You should see a `videoIdeas` collection with your data

5. **Test history feature:**
   - Click "السجل" button in the header
   - You should see your previously generated idea
   - Click on it to reload the scripts

### Step 5: Verify Everything Works

**Checklist:**
- ✅ Application loads without errors
- ✅ You can enter text in the form
- ✅ Scripts generate when you click the button
- ✅ Scripts display in beautiful cards
- ✅ Copy button works
- ✅ Ideas are saved to Firebase
- ✅ History sidebar shows saved ideas
- ✅ You can delete ideas from history

## 🎨 Optional Customization

### Change the Theme

Edit `src/App.css` line 13:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add More AI Models

Edit `src/config/openRouterConfig.js`:
```javascript
models: [
  // ...existing models
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
]
```

## 🐛 Troubleshooting

### Application won't start

**Check Node.js version:**
```bash
node --version  # Should be v16 or higher
```

**Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Firebase initialization error"

**Common causes:**
- Missing or incorrect Firebase credentials
- Extra spaces or quotes in config
- Firebase project doesn't exist

**Solution:**
1. Double-check all values in `firebaseConfig.js`
2. Verify project exists in Firebase Console
3. Check browser console for specific error

### "Invalid API key" or "401 Unauthorized"

**Common causes:**
- Incorrect OpenRouter API key
- No credits in OpenRouter account
- API key expired or deleted

**Solution:**
1. Verify API key in `openRouterConfig.js`
2. Check credits at https://openrouter.ai/credits
3. Generate a new API key if needed

### Scripts not generating

**Common causes:**
- No credits in OpenRouter
- Network connectivity issues
- API rate limiting

**Solution:**
1. Check browser console for errors
2. Verify API credits
3. Try again after a few seconds
4. Try a different AI model

### Scripts not saving to Firebase

**Common causes:**
- Firestore not enabled
- Security rules blocking writes
- Network issues

**Solution:**
1. Verify Firestore is enabled in Firebase Console
2. Check security rules (should allow writes)
3. Check browser console for errors

### Arabic text not displaying properly

**Solution:**
1. Ensure `index.html` has `lang="ar"` and `dir="rtl"`
2. Clear browser cache
3. Try a different browser

## 📞 Getting Help

If you're still having issues:

1. **Check the browser console** (F12)
   - Look for error messages
   - They usually tell you exactly what's wrong

2. **Review the README.md**
   - Contains detailed documentation
   - Has troubleshooting section

3. **Check Firebase Console**
   - Verify project is set up correctly
   - Check Firestore data

4. **Check OpenRouter Dashboard**
   - Verify API key is active
   - Check credit balance
   - Review usage logs

## 🎉 Success!

If everything is working:
- ✅ You're ready to generate amazing video scripts!
- ✅ Share it with friends and colleagues
- ✅ Start creating content for YouTube Shorts and TikTok

## 🚀 Next Steps

1. **Generate your first scripts**
2. **Experiment with different ideas**
3. **Try different AI models**
4. **Customize the theme**
5. **Deploy to production** (see README.md)

---

**Happy Scripting! 🎬**

Need help? Check CONFIG_GUIDE.md for detailed configuration info.

