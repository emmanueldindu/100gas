import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { COLORS } from './src/constants/colors';
import { FONT } from './src/constants/fonts';
import Navigation from './src/navigation';

// Set the base background color as early as possible
SystemUI.setBackgroundColorAsync('#121212');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export type InitialRoute = 'INFO' | 'AuthStack' | 'OnboardingStack' | 'BottomTabs';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<InitialRoute>('INFO');

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🔤 [App] Starting resource loading...');

        // Preload essential images, fonts and tokens simultaneously
        const [_, token] = await Promise.all([
          Asset.fromModule(require('./src/assets/icons/illustration.png')).downloadAsync(),
          Font.loadAsync({
            [FONT.garnet_400_regular]: require('./src/assets/font/Garnett-Regular.ttf'),
            [FONT.garnet_300_light]: require('./src/assets/font/Garnett-Light.ttf'),
            [FONT.garnet_500_medium]: require('./src/assets/font/Garnett-Medium.ttf'),
            [FONT.garnet_600_semibold]: require('./src/assets/font/Garnett-Semibold.ttf'),
            [FONT.garnet_700_bold]: require('./src/assets/font/Garnett-Bold.ttf'),
            [FONT.garnet_900_black]: require('./src/assets/font/Garnett-Black.ttf'),
          }),
          AsyncStorage.getItem('accessToken')
        ]);

        // Fast-track into the app if they have an active session token saved
        const resolvedRoute: InitialRoute = token ? 'BottomTabs' : 'INFO';

        setInitialRoute(resolvedRoute);
        console.log('✅ [App] Resources loaded. Initial route:', resolvedRoute);
      } catch (error) {
        console.error('❌ [App] Prepare error:', error);
        setInitialRoute('AuthStack');
      } finally {
        // Mark JS as ready
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  // Called by Navigation once the NavigationContainer (and its initial screen) is fully painted.
  const onNavigationReady = async () => {
    console.log('✅ [App] Navigation ready — hiding native splash');
    await SplashScreen.hideAsync();
  };

  if (!appReady) {
    // Native splash is still visible; render nothing beneath it
    return null;
  }

  console.log('🚀 [App] Rendering main app with initial route:', initialRoute);
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#121212' }}>
        <Navigation initialRoute={initialRoute} onReady={onNavigationReady} />
        <Toast />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
