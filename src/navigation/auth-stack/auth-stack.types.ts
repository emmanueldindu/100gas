import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenEnums from '../../enums/screen-enums';

export interface RegisterPayload {
    registrationToken?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    customerType?: string;
    state?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    cylinderData?: { size: string }[];
    qrScanSessionId?: string;
}

export type AuthStackParamList = {
    [ScreenEnums.PHONE_NUMBER]: undefined;
    [ScreenEnums.OTP]: {
        phoneNumber: string;
    } | undefined;
    [ScreenEnums.WELCOME]: {
        registrationToken?: string;
    } | undefined;
    [ScreenEnums.LOCATION]: {
        payload: RegisterPayload;
    } | undefined;
    [ScreenEnums.GAS_SIZE]: {
        payload: RegisterPayload;
    } | undefined;
    [ScreenEnums.CYLINDER_COUNT]: {
        payload: RegisterPayload;
    } | undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
