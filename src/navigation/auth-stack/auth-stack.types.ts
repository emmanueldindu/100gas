import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenEnums from '../../enums/screen-enums';

export type AuthStackParamList = {
    [ScreenEnums.PHONE_NUMBER]: undefined;
    [ScreenEnums.OTP]: {
        phoneNumber: string;
    } | undefined;
    [ScreenEnums.WELCOME]: undefined;
    [ScreenEnums.LOCATION]: undefined;
    [ScreenEnums.GAS_SIZE]: undefined;
    [ScreenEnums.CYLINDER_COUNT]: undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
