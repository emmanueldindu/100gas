import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './onboarding-stack.types';
import ScreenEnums from '../../enums/screen-enums';
import Onboarding1Screen from '../../screens/onboarding/onboarding-1';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
    return (
        <Stack.Navigator
            initialRouteName={ScreenEnums.ONBOARDING_1}
            screenOptions={{
                headerShown: false,
                animation: 'simple_push',
            }}
        >
            <Stack.Screen name={ScreenEnums.ONBOARDING_1} component={Onboarding1Screen} />
        </Stack.Navigator>
    );
}
