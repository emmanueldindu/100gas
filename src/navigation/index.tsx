import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from '../screens/screens.types';
import ScreenEnums from '../enums/screen-enums';

// Screens
import InfoScreen from '../screens/info';
import RefillGasScreen from '../screens/refill-gas';
import DeliverySummaryScreen from '../screens/delivery-summary';
import DeliveryDetailsScreen from '../screens/delivery-details';
import PersonalInfoScreen from '../screens/personal-info';
import UpdateNameScreen from '../screens/personal-info/update-name';
import UpdateEmailScreen from '../screens/personal-info/update-email';
import UpdateLocationScreen from '../screens/personal-info/update-location';
import UpdateCylinderScreen from '../screens/personal-info/update-cylinder';
import OffersAndPromosScreen from '../screens/offers';
import SupportScreen from '../screens/support';
import SupportChatScreen from '../screens/support/chat';
import SupportCallScreen from '../screens/support/call';
import SupportFaqsScreen from '../screens/support/faqs';
import DeleteAccountScreen from '../screens/profile/delete-account';

// Stacks
import AuthStack from './auth-stack';
import OnboardingStack from './onboarding-stack';
import BottomTabs from './bottom-tabs';

import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme = {
    dark: false,
    colors: {
        primary: COLORS.primary,
        background: COLORS.primary,
        card: COLORS.primary,
        text: '#FFFFFF',
        border: 'transparent',
        notification: COLORS.primary,
    },
    fonts: {
        regular: {
            fontFamily: 'System',
            fontWeight: 'normal' as const,
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500' as const,
        },
        bold: {
            fontFamily: 'System',
            fontWeight: 'bold' as const,
        },
        heavy: {
            fontFamily: 'System',
            fontWeight: '900' as const,
        },
    },
};

export type InitialRoute = keyof RootStackParamList;

export default function Navigation({ initialRoute, onReady }: { initialRoute: InitialRoute, onReady?: () => void }) {
    const navigationRef = React.useRef<NavigationContainerRef<RootStackParamList>>(null);

    return (
        <SafeAreaProvider>
            <NavigationContainer 
                ref={navigationRef} 
                onReady={onReady}
                theme={AppTheme}
            >
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={initialRoute}
                >
                    {/* Info / Splash Screen */}
                    <Stack.Screen name={ScreenEnums.INFO} component={InfoScreen} />

                    {/* Auth Stack */}
                    <Stack.Screen name="AuthStack" component={AuthStack} />

                    {/* Onboarding Stack */}
                    <Stack.Screen name="OnboardingStack" component={OnboardingStack} />

                    {/* Bottom Tabs (main app) */}
                    <Stack.Screen name="BottomTabs" component={BottomTabs} />

                    {/* Feature Screens */}
                    <Stack.Screen name={ScreenEnums.REFILL_GAS} component={RefillGasScreen} />
                    <Stack.Screen name={ScreenEnums.DELIVERY_SUMMARY} component={DeliverySummaryScreen} />
                    <Stack.Screen name={ScreenEnums.DELIVERY_DETAILS} component={DeliveryDetailsScreen} />
                    <Stack.Screen name={ScreenEnums.PERSONAL_INFO} component={PersonalInfoScreen} />
                    <Stack.Screen name={ScreenEnums.UPDATE_NAME} component={UpdateNameScreen} />
                    <Stack.Screen name={ScreenEnums.UPDATE_EMAIL} component={UpdateEmailScreen} />
                    <Stack.Screen name={ScreenEnums.UPDATE_LOCATION} component={UpdateLocationScreen} />
                    <Stack.Screen name={ScreenEnums.UPDATE_CYLINDER} component={UpdateCylinderScreen} />
                    <Stack.Screen name={ScreenEnums.OFFERS_AND_PROMOS} component={OffersAndPromosScreen} />
                    <Stack.Screen name={ScreenEnums.SUPPORT} component={SupportScreen} />
                    <Stack.Screen name={ScreenEnums.SUPPORT_CHAT} component={SupportChatScreen} />
                    <Stack.Screen name={ScreenEnums.SUPPORT_CALL} component={SupportCallScreen} />
                    <Stack.Screen name={ScreenEnums.SUPPORT_FAQS} component={SupportFaqsScreen} />
                    <Stack.Screen name={ScreenEnums.DELETE_ACCOUNT} component={DeleteAccountScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
