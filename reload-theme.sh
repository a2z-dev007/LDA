#!/bin/bash

echo "🎨 Reloading Theme Changes"
echo "=========================="
echo ""

# Clear Metro cache
echo "1️⃣ Clearing Metro cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear watchman
echo "2️⃣ Clearing Watchman..."
watchman watch-del-all 2>/dev/null || echo "   (Watchman not installed, skipping)"

echo ""
echo "✅ Cache cleared!"
echo ""
echo "Now run: npm start -- --reset-cache"
echo "Then press 'R' in Metro or reload the app"
echo ""
