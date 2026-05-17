import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenEnums from '../../../enums/screen-enums';
import { AuthStackNavigationProp } from '../../../navigation/auth-stack/auth-stack.types';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { requestOtp } from '../../../service/auth';
import NavigationHeader from '../../../components/navigation-header';

export default function PhoneNumberScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isReady = phoneNumber.length >= 7; // Allowing 7-10 digits for flexibility

    const handleRequestOtp = async () => {
        // Remove leading zero if present and ensure it starts with +234
        let formattedPhone = phoneNumber.trim();
        if (formattedPhone.startsWith('0')) {
            formattedPhone = formattedPhone.substring(1);
        }
        const payloadPhone = formattedPhone.startsWith('+') ? formattedPhone : `+234${formattedPhone}`;
        
        setIsLoading(true);
        try {
            await requestOtp(payloadPhone);
            Toast.show({
                type: 'success',
                text1: 'OTP Sent',
                text2: 'An OTP has been sent to your phone number.'
            });
            navigation.navigate(ScreenEnums.OTP, { phoneNumber: payloadPhone });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.message || 'Failed to request OTP. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryBlack }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <NavigationHeader 
                        title="Enter Phone Number" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.formContainer}>
                        <Text style={styles.description}>
                            We'll send a verification code to the number
                        </Text>

                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Enter your Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="09026190455"
                                placeholderTextColor={'#2F3338'}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                autoFocus={true}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.signUpButton,
                                (!isReady || isLoading) && styles.buttonDisabled
                            ]}
                            onPress={handleRequestOtp} 
                            activeOpacity={0.8}
                            disabled={!isReady || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={COLORS.primaryWhite} />
                            ) : (
                                <Text style={styles.signUpButtonText}>Sign up</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            By Signing Up you agree to our <Text style={styles.termsLink}>Terms</Text> and{' '}
                            <Text style={styles.termsLink}>Privacy policy</Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
        paddingHorizontal: 24,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    formContainer: {
        marginTop: 24,
    },
    description: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
        lineHeight: 20,
    },
    inputSection: {
        marginTop: 32,
    },
    label: {
        fontSize: 13,
        color: COLORS.light_gray,
        fontFamily: FONT.garnet_400_regular,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 1,
        borderColor: '#C2C2C2',
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_500_medium,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 24,
    },
    signUpButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    signUpButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
    },
    termsText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.secondaryGray,
        fontFamily: FONT.garnet_400_regular,
        lineHeight: 18,
    },
    termsLink: {
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_500_medium,
    },
});
