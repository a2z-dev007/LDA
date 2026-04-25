#!/bin/bash

echo "🎨 Applying Luxe Pink & Gold Theme"
echo "===================================="
echo ""

# Stop Metro
echo "1️⃣ Stopping Metro bundler..."
pkill -f "react-native" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2

# Clear all caches
echo "2️⃣ Clearing all caches..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
watchman watch-del-all 2>/dev/null || echo "   (Watchman not installed, skipping)"

# Clean Android build
echo "3️⃣ Cleaning Android build..."
cd android
./gradlew clean > /dev/null 2>&1
cd ..

echo ""
echo "✅ All caches cleared and Android cleaned!"
echo ""
echo "📱 Now rebuilding with new theme..."
echo ""

# Start Metro with reset cache in background
npm start -- --reset-cache &
METRO_PID=$!

echo "Metro started (PID: $METRO_PID)"
echo "Waiting 10 seconds for Metro to initialize..."
sleep 10

echo ""
echo "Building and installing app..."
npm run android

echo ""
echo "✅ Done! Check the Metro logs above for theme debug info:"
echo "   Look for: 🎨 Active Theme: luxePinkGold"
echo "   Look for: 🎨 Primary Color: #FF6B9D"
echo ""
echo "If you see the old colors in logs, there's an import issue."
echo "To stop Metro: kill $METRO_PID"
