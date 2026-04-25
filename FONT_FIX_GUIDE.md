# Font Fix Guide

## Problem
Fonts are not applying in the app even though they're properly configured.

## Solution

### Step 1: Rebuild the App (REQUIRED)

Fonts are bundled at build time, so you **must rebuild** the app after adding or changing fonts.

#### For Android:
```bash
# Clean the build
cd android
./gradlew clean
cd ..

# Rebuild and run
npm run android
```

#### For iOS:
```bash
# Clean the build
cd ios
rm -rf build
pod install
cd ..

# Rebuild and run
npm run ios
```

### Step 2: Verify Font Names

The font family names in your styles should match the font file names **without the extension**.

✅ **Correct Font Names:**
- `DMSans-Regular`
- `DMSans-Medium`
- `DMSans-Bold`
- `DMSans-Italic`
- `PlayfairDisplay-Regular`
- `PlayfairDisplay-Italic`
- `PlayfairDisplay-SemiBold`
- `PlayfairDisplay-MediumItalic`

❌ **Incorrect:**
- `DM Sans` (with space)
- `DMSans` (without variant)
- `Playfair Display` (with space)

### Step 3: Font Usage in Styles

```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',  // Optional, but helps on some platforms
  },
  boldText: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  mediumText: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
  },
  italicTitle: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontStyle: 'italic',
  },
});
```

### Step 4: Common Issues

#### Issue 1: Font not loading on Android
**Solution:** Make sure you've run `npx react-native-asset` or rebuilt the app

#### Issue 2: Font not loading on iOS
**Solution:** 
1. Check `ios/LDA/Info.plist` has all fonts listed under `UIAppFonts`
2. Run `cd ios && pod install && cd ..`
3. Rebuild the app

#### Issue 3: Font looks different than expected
**Solution:** Make sure you're using the correct font variant:
- For bold text: Use `DMSans-Bold` not `DMSans-Regular` with `fontWeight: 'bold'`
- For italic text: Use `PlayfairDisplay-Italic` not `PlayfairDisplay-Regular` with `fontStyle: 'italic'`

### Step 5: Test Font Loading

Create a test component to verify fonts are working:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const FontTest = () => (
  <View style={styles.container}>
    <Text style={styles.regular}>DMSans Regular</Text>
    <Text style={styles.medium}>DMSans Medium</Text>
    <Text style={styles.bold}>DMSans Bold</Text>
    <Text style={styles.italic}>PlayfairDisplay Italic</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1A0B2E',
  },
  regular: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  medium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bold: {
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  italic: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 18,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
});
```

## Quick Fix Commands

Run these commands in order:

```bash
# 1. Stop the metro bundler (Ctrl+C if running)

# 2. Clean and rebuild for Android
cd android && ./gradlew clean && cd ..
npm run android

# OR for iOS
cd ios && rm -rf build && pod install && cd ..
npm run ios

# 3. If still not working, reset cache
npm start -- --reset-cache
```

## Verification Checklist

- [ ] Fonts exist in `assets/fonts/` directory
- [ ] Fonts are listed in `react-native.config.js`
- [ ] Fonts are copied to `android/app/src/main/assets/fonts/`
- [ ] Fonts are listed in `ios/LDA/Info.plist` under `UIAppFonts`
- [ ] App has been rebuilt (not just reloaded)
- [ ] Font family names match file names exactly (without .ttf)
- [ ] Using correct font variants (Bold, Medium, Italic, etc.)

## Current Font Configuration

Your app has these fonts properly configured:
- ✅ DMSans-Regular.ttf
- ✅ DMSans-Medium.ttf
- ✅ DMSans-Bold.ttf
- ✅ DMSans-Italic.ttf
- ✅ PlayfairDisplay-Regular.ttf
- ✅ PlayfairDisplay-Italic.ttf
- ✅ PlayfairDisplay-SemiBold.ttf
- ✅ PlayfairDisplay-MediumItalic.ttf

**You just need to rebuild the app!**
