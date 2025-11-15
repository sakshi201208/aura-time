import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.17653f9170be4fd99fc46dd884b31bd5',
  appName: 'Premium Clock',
  webDir: 'dist',
  server: {
    url: 'https://17653f91-70be-4fd9-9fc4-6dd884b31bd5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
