import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './auth-stack.types';
import ScreenEnums from '../../enums/screen-enums';
import PhoneNumberScreen from '../../screens/auth/phone-number';
import OTPScreen from '../../screens/auth/otp';
import WelcomeScreen from '../../screens/auth/welcome';
import LocationScreen from '../../screens/auth/location';
import CustomerTypeAuthScreen from '../../screens/auth/customer-type';
import GasSizeScreen from '../../screens/auth/gas-size';
import CylinderCountScreen from '../../screens/auth/cylinder-count';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName={ScreenEnums.PHONE_NUMBER}
            screenOptions={{
                headerShown: false,
                animation: 'simple_push',
            }}
        >
            <Stack.Screen name={ScreenEnums.PHONE_NUMBER} component={PhoneNumberScreen} />
            <Stack.Screen name={ScreenEnums.OTP} component={OTPScreen} />
            <Stack.Screen name={ScreenEnums.WELCOME} component={WelcomeScreen} />
            <Stack.Screen name={ScreenEnums.LOCATION} component={LocationScreen} />
            <Stack.Screen name={ScreenEnums.CUSTOMER_TYPE_AUTH} component={CustomerTypeAuthScreen} />
            <Stack.Screen name={ScreenEnums.GAS_SIZE} component={GasSizeScreen} />
            <Stack.Screen name={ScreenEnums.CYLINDER_COUNT} component={CylinderCountScreen} />
        </Stack.Navigator>
    );
}
