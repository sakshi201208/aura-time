# Android APK Setup Guide

## Quick Start for Android

### Prerequisites
- Node.js and npm installed
- Android Studio installed
- Git installed

### Step-by-Step Instructions

1. **Export to GitHub**
   - Click the GitHub button in Lovable (top right)
   - Connect your GitHub account
   - Export the project to a new repository

2. **Clone Your Project Locally**
   ```bash
   git clone <your-github-repo-url>
   cd <your-project-folder>
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Initialize Capacitor** (Already configured)
   The `capacitor.config.ts` is already set up with:
   - App ID: `app.lovable.17653f9170be4fd99fc46dd884b31bd5`
   - App Name: `Premium Clock`

5. **Add Android Platform**
   ```bash
   npx cap add android
   ```

6. **Build the Web Assets**
   ```bash
   npm run build
   ```

7. **Sync with Android**
   ```bash
   npx cap sync android
   ```

8. **Open in Android Studio**
   ```bash
   npx cap open android
   ```
   
   Or manually open Android Studio and select:
   `File > Open > [your-project]/android`

9. **Run on Device/Emulator**
   In Android Studio:
   - Connect your Android device via USB (with USB debugging enabled)
   - OR start an Android emulator
   - Click the green "Run" button (▶️)

### Alternative: Direct Run Command
After step 7, you can run directly:
```bash
npx cap run android
```

## After Making Changes in Lovable

Whenever you make changes in Lovable:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Rebuild and sync**
   ```bash
   npm run build
   npx cap sync android
   ```

3. **Run again**
   ```bash
   npx cap run android
   ```

## Development Mode (Live Reload)

The app is configured to use hot-reload from the Lovable sandbox during development:
- URL: `https://17653f91-70be-4fd9-9fc4-6dd884b31bd5.lovableproject.com`
- This means you can see changes in real-time without rebuilding

To disable this for production:
1. Remove the `server` section from `capacitor.config.ts`
2. Rebuild and sync

## Building Production APK

### Debug APK
In Android Studio:
1. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Find APK in: `android/app/build/outputs/apk/debug/`

### Release APK (Signed)
1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure signing in Android Studio:
   - `Build > Generate Signed Bundle / APK`
   - Select APK
   - Create new or choose existing keystore
   - Fill in the details

3. Build the release APK

## Troubleshooting

### Gradle Issues
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### USB Debugging Not Working
- Enable Developer Options on your Android device
- Enable USB Debugging
- Accept the RSA fingerprint prompt on your device

### App Not Installing
- Uninstall any previous version of the app
- Check Android version compatibility (minimum SDK 22/Android 5.1)

### Performance Issues
- Use a Release build instead of Debug
- Enable ProGuard/R8 optimization in Android Studio

## Features Optimized for Android

✅ **Battery API** - Auto-start when charging  
✅ **Haptic Feedback** - Native vibration support  
✅ **Fullscreen Mode** - Immersive experience  
✅ **OLED Optimization** - Pure black backgrounds  
✅ **Touch Gestures** - Swipe, pinch, tap controls  
✅ **Persistent Storage** - LocalStorage for settings & laps  
✅ **Offline Ready** - No internet required  

## Support

For more information about Capacitor:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
