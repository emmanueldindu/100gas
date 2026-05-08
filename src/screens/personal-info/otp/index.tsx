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
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootStackNavigationProp } from '../../screens.types';
import ScreenEnums from '../../../enums/screen-enums';
import { COLORS } from '../../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT } from '../../../constants/fonts';
import NavigationHeader from '@/src/components/navigation-header';

export default function ProfileOTPScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'PROFILE_OTP'>>();
    const phoneNumber = route.params?.phoneNumber || '0902 000 0455';
    
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRef = useRef<TextInput>(null);

    // Countdown Timer Logic
    React.useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const renderOtpBoxes = () => {
        const boxes = [];
        for (let i = 0; i < 6; i++) {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryBlack }}>
            <StatusBar barStyle="light-content" />
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
                        title="OTP Verification" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.content}>
                        <Text style={styles.description}>
                            Enter the 6 digit PIN sent to the number
                        </Text>

                        <View style={styles.phoneBox}>
                            <Text style={styles.phoneText}>{phoneNumber}</Text>
                        </View>

                        <Text style={styles.timerText}>
                            Expires in: <Text style={styles.timerSeconds}>{timeLeft} secs</Text>
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
                                if (val.length <= 6) {
                                    setOtp(val);
                                    if (val.length === 6) {
                                        // Focus on design: navigation back for now
                                        setTimeout(() => {
                                            navigation.navigate(ScreenEnums.PERSONAL_INFO);
                                        }, 500);
                                    }
                                }
                            }}
                            keyboardType="number-pad"
                            maxLength={6}
                            autoFocus
                        />

                        <TouchableOpacity 
                            style={styles.resendContainer}
                            onPress={() => setTimeLeft(60)}
                            disabled={timeLeft > 0}
                        >
                            <Text style={styles.resendText}>
                                Didn't receive the code? Resend OTP
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                        {isLoading && (
                            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    content: {
        alignItems: 'center',
        marginTop: 24,
    },
    description: {
        fontSize: 14,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
        textAlign: 'center',
    },
    phoneBox: {
        backgroundColor: '#e8442b0b',
        width: '100%',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    phoneText: {
        fontSize: 24,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_500_medium,
        letterSpacing: 1,
    },
    timerText: {
        marginTop: 24,
        fontSize: 14,
        color: COLORS.secondaryGray,
        fontFamily: FONT.garnet_400_regular,
    },
    timerSeconds: {
        color: COLORS.primary,
        fontFamily: FONT.garnet_500_medium,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 16,
    },
    otpBox: {
        width: 44,
        height: 48,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2F3338',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    otpBoxFocused: {
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    otpText: {
        fontSize: 20,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_600_semibold,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 32,
    },
    resendText: {
        fontSize: 14,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
    },
});
