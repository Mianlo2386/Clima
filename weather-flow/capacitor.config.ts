import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weatherflow.app',
  appName: 'WeatherFlow',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
