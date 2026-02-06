#!/bin/bash

# Video Script Generator - Setup Script
echo "🎬 Video Script Generator - Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "⚙️  Configuration Setup"
echo "======================"
echo ""
echo "You need to configure two files:"
echo ""
echo "1. Firebase Configuration"
echo "   File: src/config/firebaseConfig.js"
echo "   - Go to: https://console.firebase.google.com/"
echo "   - Create a project and enable Firestore"
echo "   - Get your config from Project Settings"
echo ""
echo "2. OpenRouter API Key"
echo "   File: src/config/openRouterConfig.js"
echo "   - Go to: https://openrouter.ai/"
echo "   - Sign up and get your API key"
echo "   - Add credits to your account"
echo ""
echo "📖 For detailed instructions, see CONFIG_GUIDE.md"
echo ""

# Ask if user wants to open the config files
read -p "Do you want to open the configuration files now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Opening configuration files..."

    # Try to open with common editors
    if command -v code &> /dev/null; then
        code src/config/firebaseConfig.js
        code src/config/openRouterConfig.js
    elif command -v nano &> /dev/null; then
        nano src/config/firebaseConfig.js
        nano src/config/openRouterConfig.js
    else
        echo "Please manually edit:"
        echo "  - src/config/firebaseConfig.js"
        echo "  - src/config/openRouterConfig.js"
    fi
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure Firebase (src/config/firebaseConfig.js)"
echo "2. Configure OpenRouter (src/config/openRouterConfig.js)"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:5173"
echo ""
echo "Happy scripting! 🚀"

