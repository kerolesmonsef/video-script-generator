# Configuration Guide

## Firebase Configuration

Replace the values in `src/config/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### How to get Firebase credentials:

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Click the gear icon ⚙️ > Project settings
4. Scroll to "Your apps" section
5. Click the web icon `</>`
6. Register your app (give it a nickname)
7. Copy the configuration object shown

### Enable Firestore:

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select production mode or test mode
4. Choose a location (closest to your users)
5. Click "Enable"

### Security Rules (for testing):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videoIdeas/{document=**} {
      allow read, write: if true; // WARNING: Only for testing!
    }
  }
}
```

### Security Rules (for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videoIdeas/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## OpenRouter Configuration

Replace the value in `src/config/openRouterConfig.js`:

```javascript
export const OPENROUTER_CONFIG = {
  apiKey: "YOUR_OPENROUTER_API_KEY",
  // ...
};
```

### How to get OpenRouter API key:

1. Go to https://openrouter.ai/
2. Sign up or log in
3. Go to https://openrouter.ai/keys
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-`)
6. Add credits at https://openrouter.ai/credits

### Recommended models:

- **Claude 3.5 Sonnet**: Best for Arabic content
- **GPT-4 Turbo**: Great alternative
- **GPT-3.5 Turbo**: Faster and cheaper

### API Costs (approximate):

- Claude 3.5 Sonnet: ~$3 per 1M input tokens
- GPT-4 Turbo: ~$10 per 1M input tokens
- GPT-3.5 Turbo: ~$0.50 per 1M input tokens

Generating 3 scripts typically uses ~1,000-2,000 tokens.

## Testing Your Setup

1. Make sure both config files are updated
2. Run `npm run dev`
3. Open http://localhost:5173
4. Try generating a simple script
5. Check browser console for any errors
6. Verify scripts appear in Firebase Console

## Common Issues

### "Firebase initialization error"
- Check if all Firebase config values are correct
- Ensure no extra quotes or spaces
- Verify project exists in Firebase Console

### "Invalid API key" or "401 Unauthorized"
- Verify OpenRouter API key is correct
- Make sure key starts with `sk-or-v1-`
- Check if you have credits in your account

### "Failed to save to Firebase"
- Check Firestore security rules
- Ensure Firestore is enabled
- Verify internet connection

### "CORS error"
- This should not happen with OpenRouter
- If it does, check API key and headers
- Make sure you're using HTTPS in production

## Need Help?

- Firebase Docs: https://firebase.google.com/docs
- OpenRouter Docs: https://openrouter.ai/docs
- React Docs: https://react.dev

