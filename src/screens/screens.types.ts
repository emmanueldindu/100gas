import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/auth-stack/auth-stack.types';
import { OnboardingStackParamList } from '../navigation/onboarding-stack/onboarding-stack.types';

export type RootStackParamList = {
    INFO: undefined;
    BottomTabs: { screen?: string } | undefined;
    AuthStack: NavigatorScreenParams<AuthStackParamList>;
    OnboardingStack: NavigatorScreenParams<OnboardingStackParamList>;
    REFILL_GAS: undefined;
    DELIVERY_SUMMARY: undefined;
    DELIVERY_DETAILS: undefined;
    PERSONAL_INFO: undefined;
    UPDATE_NAME: undefined;
    UPDATE_EMAIL: undefined;
    UPDATE_LOCATION: undefined;
    UPDATE_CYLINDER: undefined;
    OFFERS_AND_PROMOS: undefined;
    SUPPORT: undefined;
    SUPPORT_CHAT: undefined;
    SUPPORT_CALL: undefined;
    SUPPORT_FAQS: undefined;
    DELETE_ACCOUNT: undefined;
    PAYMENT_SUCCESS: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface ScreenProps<T extends keyof RootStackParamList> {
    navigation: RootStackNavigationProp;
    route: {
        params: RootStackParamList[T];
    };
}
