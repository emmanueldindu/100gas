import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList, AuthStackNavigationProp } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';
import { COLORS } from '../../../constants/colors';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { verifyOtp } from '../../../service/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OTPScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'OTP'>>();
    const phoneNumber = route.params?.phoneNumber || '+234 000 000 000';
    
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const scrollRef = useRef<ScrollView>(null);

    const onFocus = () => {
        // Give the keyboard time to open, then scroll to the bottom of the content
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleVerifyOtp = async (code: string) => {
        if (code.length !== 4) return;
        setIsLoading(true);
        try {
            const response = await verifyOtp(phoneNumber, code);
            console.log('OTP Verify Full Response:', JSON.stringify(response, null, 2));

            const data = response?.data || response; // Fallback in case the backend nests it differently
            
            if (data?.isNewUser === true) {
                const token = data?.registrationToken || '';
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'OTP verified successfully.'
                });
                navigation.navigate(ScreenEnums.WELCOME, { registrationToken: token });
            } else {
                const accessToken = data?.tokens?.accessToken;
                const refreshToken = data?.tokens?.refreshToken;

                if (accessToken) {
                    await AsyncStorage.setItem('accessToken', accessToken);
                }
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                }
                
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Welcome back to 100gas!'
                });
                (navigation as any).navigate(ScreenEnums.BOTTOM_TABS);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error?.message || 'Invalid OTP. Please try again.'
            });
            setOtp(''); // Optionally clear the input if wrong
        } finally {
            setIsLoading(false);
        }
    };

    const renderOtpBoxes = () => {
        const boxes = [];
        for (let i = 0; i < 4; i++) {
            const char = otp[i] || '';
            const isFocused = otp.length === i;
            boxes.push(
                <View 
                    key={i} 
                    style={[
                        styles.otpBox,
                        isFocused && styles.otpBoxFocused
                    ]}
                >
                    <Text style={styles.otpText}>{char}</Text>
                </View>
            );
        }
        return boxes;
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView 
                    ref={scrollRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </TouchableOpacity>

                    {/* Top Image */}
                    <View style={styles.imageContainer}>
                        <Image 
                            source={require('../../../assets/images/infobg.png')} 
                            style={styles.image}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    </View>

                    {/* Form Content */}
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Confirm OTP</Text>
                        
                        <Text style={styles.subtext}>
                            A OTP has been sent to <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
                            {'\n'}Kind enter below the 4 digit code.
                        </Text>
                        
                        <Pressable 
                            style={styles.otpContainer}
                            onPress={() => inputRef.current?.focus()}
                        >
                            {renderOtpBoxes()}
                        </Pressable>

                        <TextInput
                            ref={inputRef}
                            style={styles.hiddenInput}
                            value={otp}
                            onChangeText={(val) => {
                                if (val.length <= 4) {
                                    setOtp(val);
                                    if (val.length === 4) {
                                        handleVerifyOtp(val);
                                    }
                                }
                            }}
                            keyboardType="number-pad"
                            maxLength={4}
                            autoFocus
                            onFocus={onFocus}
                            editable={!isLoading}
                        />

                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
                        </View>

                    </View>
                 
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: '100%',
        height: 400,
    },
    formContainer: {
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 12,
    },
    subtext: {
        fontSize: 16,
        color: '#2F3338',
        lineHeight: 24,
        marginBottom: 32,
    },
    phoneHighlight: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        gap:40,
        // alignItems:'center',
        justifyContent: 'center',
        width: '100%',
    },
    otpBox: {
        width: 48,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDDDDF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryWhite,
    },
    otpBoxFocused: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    otpText: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.black,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    buttonWrapper: {
        marginTop: 40,
        width: '100%',
    },
    verifyButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonDisabled: {
        backgroundColor: COLORS.secondaryGray,
        shadowOpacity: 0,
        elevation: 0,
    },
    verifyButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
