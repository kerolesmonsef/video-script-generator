# 🎬 Video Script Generator - مولد سكريبتات الفيديو

A professional React application that generates Arabic video scripts for YouTube Shorts and TikTok using AI (OpenRouter API) with Firebase storage.

## 📋 Features

- ✨ **AI-Powered Script Generation**: Uses OpenRouter API with multiple LLM models
- 🌐 **Arabic Support**: Full RTL layout with Arabic content
- 🔥 **Firebase Integration**: Store and retrieve generated scripts
- 📜 **History Management**: View, reload, and delete previous ideas
- 🎨 **Beautiful UI**: Modern, responsive design with glassmorphism effects
- 🤖 **Multiple AI Models**: Support for Claude, GPT-4, Gemini, and Llama
- 📋 **Copy to Clipboard**: Easy sharing of generated scripts
- ⚡ **Fast & Responsive**: Built with Vite for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- OpenRouter API key

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /var/www/html/video-script-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database:
     - Click "Firestore Database" in the left menu
     - Click "Create database"
     - Choose "Start in production mode" or "Test mode"
     - Select a location
   
   - Get your Firebase credentials:
     - Click the gear icon ⚙️ next to "Project Overview"
     - Click "Project settings"
     - Scroll to "Your apps" section
     - Click the web icon `</>`
     - Register your app
     - Copy the configuration object
   
   - Update `src/config/firebaseConfig.js`:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abcdef123456"
     };
     ```

4. **Configure OpenRouter API:**
   
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Go to [API Keys](https://openrouter.ai/keys)
   - Create a new API key
   - Add credits to your account
   
   - Update `src/config/openRouterConfig.js`:
     ```javascript
     export const OPENROUTER_CONFIG = {
       apiKey: "sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
       // ...rest of the config
     };
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
video-script-generator/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── ScriptCard.js       # Script display component
│   │   ├── ScriptCard.css      # ScriptCard styles
│   │   ├── ScriptGenerator.js  # Form component
│   │   └── ScriptGenerator.css # Generator styles
│   ├── config/
│   │   ├── firebaseConfig.js   # Firebase credentials
│   │   └── openRouterConfig.js # OpenRouter API config
│   ├── services/
│   │   ├── firebaseService.js  # Firestore operations
│   │   └── openRouterService.js # AI script generation
│   ├── App.js                  # Main component
│   ├── App.css                 # Main app styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 📦 Dependencies

- **react**: UI framework
- **react-dom**: React DOM rendering
- **firebase**: Firestore database
- **axios**: HTTP client for API calls
- **react-icons**: Icon library
- **vite**: Build tool and dev server

## 🎯 How to Use

### 1. Enter Video Idea
Type your video concept in Arabic:
```
مثال: فيديو عن الفواكه تتحدث وتعطي فوائد وأضرار تناولها
```

### 2. Set Number of Scripts
Choose between 1-10 scripts to generate

### 3. Select AI Model
Pick from available models:
- **Claude 3.5 Sonnet** (Recommended for Arabic)
- GPT-4 Turbo
- GPT-3.5 Turbo
- Gemini Pro
- Llama 3.1 70B

### 4. Generate Scripts
Click "إنشاء السكريبتات" and wait for AI to generate

### 5. View Results
Scripts appear in beautiful cards with:
- Title (Arabic)
- Visual Description (for AI video tools)
- Voice Text (5-second narration)
- Benefit
- Drawback
- Platform badges (YouTube Shorts, TikTok)
- Copy button

### 6. Manage History
- Click "السجل" to view previous ideas
- Click any item to reload its scripts
- Click 🗑️ to delete unwanted ideas

## 🔧 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Build
```bash
npm run build
```
Creates an optimized production build in `dist/` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## 🎨 Customization

### Change Theme Colors

Edit `src/App.css`:
```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your preferred colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add More AI Models

Edit `src/config/openRouterConfig.js`:
```javascript
models: [
  { id: 'your-model-id', name: 'Your Model Name' },
  // Add more models here
]
```

### Modify Script Output Format

Edit the prompt in `src/services/openRouterService.js`

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Add to .gitignore:**
   ```
   # Environment files
   .env
   .env.local
   
   # Firebase config (if you want to keep it private)
   src/config/firebaseConfig.js
   src/config/openRouterConfig.js
   ```

3. **Firebase Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /videoIdeas/{document=**} {
         allow read, write: if request.auth != null; // Authenticated users only
         // Or for public access during testing:
         // allow read, write: if true;
       }
     }
   }
   ```

4. **Monitor API Usage**: Check OpenRouter dashboard regularly

## 🐛 Troubleshooting

### 🔥 Firebase Permissions Error (MOST COMMON!)
**Error:** `FirebaseError: Missing or insufficient permissions`

**Quick Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Firestore Database" → "Rules" tab
4. Replace all rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
5. Click "Publish"
6. Refresh your app

**📖 Detailed Guide:** See `FIX_PERMISSIONS_NOW.txt` or `FIREBASE_PERMISSIONS_FIX.md`

### Scripts not generating?
- ✅ Check browser console for errors
- ✅ Verify OpenRouter API key is correct
- ✅ Ensure you have API credits
- ✅ Check network connectivity
- ✅ Try a different AI model

### Firebase not saving?
- ✅ **First, check for permissions error above** ⬆️
- ✅ Verify Firebase configuration
- ✅ Check Firestore security rules
- ✅ Ensure Firestore is enabled
- ✅ Look for errors in browser console

### Build errors?
- ✅ Delete `node_modules` and `package-lock.json`
- ✅ Run `npm install` again
- ✅ Check Node.js version (v16+)

### Arabic text issues?
- ✅ Ensure `dir="rtl"` is set in HTML
- ✅ Check font support for Arabic
- ✅ Verify browser encoding is UTF-8

## 📱 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
npm run build
firebase init hosting
firebase deploy
```

## 💡 Tips for Best Results

1. **Be Specific**: Provide detailed video ideas
2. **Use Claude**: Best Arabic language support
3. **Start Small**: Generate 2-3 scripts first
4. **Review & Edit**: Always review AI-generated content
5. **Save Good Examples**: Use history feature

## 🎓 Example Ideas to Try

```
فيديو عن الحيوانات تتكلم عن فوائدها للبيئة
فيديو طبخ سريع لأطباق عربية تقليدية
نصائح صحية يومية للياقة البدنية
حقائق علمية مثيرة بطريقة مبسطة
تحديات ممتعة للأصدقاء والعائلة
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

For issues or questions:
1. Check this README thoroughly
2. Review browser console errors
3. Verify all configuration settings
4. Check Firebase and OpenRouter dashboards

## 🙏 Acknowledgments

- **OpenRouter**: AI API platform
- **Firebase**: Backend infrastructure
- **React**: UI framework
- **Vite**: Build tool
- **React Icons**: Icon library

---

**Made with ❤️ for Content Creators**

مصنوع بـ ❤️ لصناع المحتوى

