# 🔧 How to Fix Fonts Not Applying

## The Main Issue

**Fonts require a full rebuild of the app to take effect.** Simply reloading or hot-reloading won't work.

## ✅ Quick Fix (Do This First)

### For Android:
```bash
# Stop the metro bundler (Ctrl+C)

# Clean and rebuild
cd android
./gradlew clean
cd ..

# Run the app
npm run android
```

### For iOS:
```bash
# Stop the metro bundler (Ctrl+C)

# Clean and rebuild
cd ios
rm -rf build
pod install
cd ..

# Run the app
npm run ios
```

## 📝 Verification

After rebuilding, your fonts should work! You can verify by checking:

1. **SplashScreen** - Should show:
   - "LET'S DATE AGAIN" in DMSans-Medium
   - Quote in PlayfairDisplay-Italic
   - Button text in DMSans-Bold

2. **CommitmentScreen** - Should show:
   - Title in PlayfairDisplay-Italic
   - Body text in DMSans-Regular
   - Button in DMSans-Bold

## 🎨 Using Typography System

Instead of manually specifying fonts, use the centralized typography system:

```typescript
import { typography, fonts } from '../theme';

const styles = StyleSheet.create({
  // Using typography presets (RECOMMENDED)
  title: {
    ...typography.displayItalic,
    color: colors.textLight,
  },
  
  quote: {
    ...typography.quoteItalicLarge,
    color: colors.textLight,
  },
  
  body: {
    ...typography.bodyMedium,
    color: colors.textLight,
  },
  
  button: {
    ...typography.buttonLarge,
    color: colors.white,
  },
  
  label: {
    ...typography.labelBold,
    color: colors.primary,
  },
  
  // Or using font families directly
  customText: {
    fontFamily: fonts.dmSansBold,
    fontSize: 20,
    color: colors.textLight,
  },
});
```

## 📚 Available Typography Styles

### Display (Playfair Display)
- `typography.displayLarge` - 36px, SemiBold
- `typography.displayMedium` - 28px, SemiBold
- `typography.displayItalic` - 32px, Italic
- `typography.quoteItalic` - 24px, Italic
- `typography.quoteItalicLarge` - 26px, Italic

### Body (DM Sans)
- `typography.bodyLarge` - 18px, Regular
- `typography.bodyMedium` - 16px, Regular
- `typography.bodySmall` - 14px, Regular
- `typography.bodyBold` - 16px, Bold

### Labels (DM Sans)
- `typography.labelLarge` - 17px, Medium
- `typography.labelMedium` - 14px, Medium
- `typography.labelSmall` - 12px, Medium
- `typography.labelBold` - 11px, Bold

### Buttons (DM Sans)
- `typography.button` - 17px, Medium
- `typography.buttonLarge` - 18px, Bold

### Captions (DM Sans)
- `typography.caption` - 11px, Regular
- `typography.captionSmall` - 10px, Regular

## 🔤 Available Font Families

```typescript
import { fonts } from '../theme';

// DM Sans
fonts.dmSansRegular    // 'DMSans-Regular'
fonts.dmSansMedium     // 'DMSans-Medium'
fonts.dmSansBold       // 'DMSans-Bold'
fonts.dmSansItalic     // 'DMSans-Italic'

// Playfair Display
fonts.playfairRegular       // 'PlayfairDisplay-Regular'
fonts.playfairItalic        // 'PlayfairDisplay-Italic'
fonts.playfairSemiBold      // 'PlayfairDisplay-SemiBold'
fonts.playfairMediumItalic  // 'PlayfairDisplay-MediumItalic'
```

## ⚠️ Common Mistakes

### ❌ Wrong:
```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'DM Sans',  // Has space
    fontWeight: 'bold',     // Using weight instead of Bold font
  },
});
```

### ✅ Correct:
```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'DMSans-Bold',  // No space, includes variant
    fontWeight: '700',          // Optional but helps
  },
});
```

## 🔍 Troubleshooting

### Fonts still not showing after rebuild?

1. **Clear Metro cache:**
   ```bash
   npm start -- --reset-cache
   ```

2. **Check font files exist:**
   ```bash
   ls assets/fonts/
   ls android/app/src/main/assets/fonts/
   ```

3. **Verify iOS configuration:**
   ```bash
   cat ios/LDA/Info.plist | grep -A 10 UIAppFonts
   ```

4. **Complete clean:**
   ```bash
   # Android
   cd android
   ./gradlew clean
   rm -rf build
   rm -rf app/build
   cd ..
   
   # iOS
   cd ios
   rm -rf build
   rm -rf Pods
   pod install
   cd ..
   
   # Metro
   rm -rf node_modules
   npm install
   npm start -- --reset-cache
   ```

## 📱 Platform-Specific Notes

### Android
- Font family names are case-sensitive
- Must match the file name exactly (without .ttf)
- Requires rebuild, not just reload

### iOS
- Fonts must be listed in Info.plist
- Font family names must match file names
- Run `pod install` after adding new fonts

## ✨ Best Practices

1. **Use typography presets** instead of manual font styling
2. **Always rebuild** after adding/changing fonts
3. **Use the correct font variant** (Bold, Medium, Italic) instead of fontWeight/fontStyle
4. **Import from theme** for consistency:
   ```typescript
   import { typography, fonts, colors } from '../theme';
   ```

## 🎯 Summary

**The #1 reason fonts don't work: You didn't rebuild the app!**

Run this and your fonts will work:
```bash
cd android && ./gradlew clean && cd .. && npm run android
```

That's it! 🎉
