import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';
import Toast from 'react-native-toast-message';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { COLORS } from './src/constants/colors';

// Set the base background color as early as possible
SystemUI.setBackgroundColorAsync(COLORS.primaryWhite);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export type InitialRoute = 'INFO' | 'AuthStack' | 'OnboardingStack' | 'BottomTabs';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<InitialRoute>('INFO');

  useEffect(() => {
    async function prepare() {
      try {
        console.log('🔤 [App] Starting resource loading...');
        
        // Preload essential images
        await Promise.all([
          Asset.fromModule(require('./src/assets/images/infobg.png')).downloadAsync(),
          Asset.fromModule(require('./src/assets/icons/logo.png')).downloadAsync(),
        ]);
        
        // Temporarily just resolve to BottomTabs as start
        const resolvedRoute: InitialRoute = 'BottomTabs';
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
        <Navigation initialRoute={initialRoute} onReady={onNavigationReady} />
        <Toast />
    </GestureHandlerRootView>
  );
}
