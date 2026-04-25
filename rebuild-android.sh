#!/bin/bash

echo "🔧 Rebuilding Android App with Fonts"
echo "====================================="
echo ""

# Stop any running processes
echo "1️⃣ Stopping Metro and existing processes..."
pkill -f "react-native" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2

# Clear Metro cache
echo "2️⃣ Clearing Metro cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear watchman if available
echo "3️⃣ Clearing Watchman..."
watchman watch-del-all 2>/dev/null || echo "   (Watchman not installed, skipping)"

# Clean Android build (already done)
echo "4️⃣ Android build cleaned ✓"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Now starting Metro bundler with reset cache..."
echo ""

# Start Metro in background with reset cache
npm start -- --reset-cache &
METRO_PID=$!

echo "Metro started (PID: $METRO_PID)"
echo ""
echo "Waiting 10 seconds for Metro to initialize..."
sleep 10

echo ""
echo "Now building and installing the app..."
echo ""

# Run Android
npm run android

echo ""
echo "✅ Done! The app should now have fonts working."
echo ""
echo "If fonts still don't work, the font files themselves might be corrupted."
echo "To stop Metro: kill $METRO_PID"
