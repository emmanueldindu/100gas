import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenEnums from '../../enums/screen-enums';

export type OnboardingStackParamList = {
    [ScreenEnums.ONBOARDING_1]: undefined;
};

export type OnboardingStackNavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
