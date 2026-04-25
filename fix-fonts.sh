#!/bin/bash

echo "🔧 Fixing Fonts - Complete Reset"
echo "================================"
echo ""

# Kill any running Metro bundler
echo "1️⃣ Stopping Metro bundler..."
pkill -f "react-native" || true
pkill -f "metro" || true

# Clear Metro cache
echo "2️⃣ Clearing Metro cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true

# Clear watchman
echo "3️⃣ Clearing Watchman..."
watchman watch-del-all 2>/dev/null || echo "  (Watchman not installed, skipping)"

# Android: Clean and rebuild
echo "4️⃣ Cleaning Android build..."
cd android
./gradlew clean
cd ..

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Now run ONE of these commands:"
echo ""
echo "For Android:"
echo "  npm start -- --reset-cache"
echo "  (In another terminal) npm run android"
echo ""
echo "For iOS:"
echo "  npm start -- --reset-cache"
echo "  (In another terminal) npm run ios"
echo ""
