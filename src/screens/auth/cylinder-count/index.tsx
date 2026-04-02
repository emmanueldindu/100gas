import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { registerUser } from '../../../service/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

export default function CylinderCountScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'CYLINDER_COUNT'>>();
    
    const [count, setCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isReady = count.length > 0;

    const handleContinue = async () => {
        setIsLoading(true);

        const baseSize = route.params?.payload?.cylinderData?.[0]?.size || "KG_3";
        const quantity = parseInt(count, 10) || 1;
        const newCylinderData = Array(quantity).fill({ size: baseSize });

        const finalPayload = {
            ...route.params?.payload,
            customerType: route.params?.payload?.customerType || 'HOUSEHOLD',
            cylinderData: newCylinderData,
            qrScanSessionId: route.params?.payload?.qrScanSessionId || "00000000-0000-0000-0000-000000000000"
        };

        try {
            const response = await registerUser(finalPayload);
            
            // Extract exact tokens if returned on registration
            const accessToken = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
            const refreshToken = response?.data?.refreshToken || response?.refreshToken;
            
            if (accessToken) {
                await AsyncStorage.setItem('accessToken', accessToken);
            }
            if (refreshToken) {
                await AsyncStorage.setItem('refreshToken', refreshToken);
            }

            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Welcome to 100gas!'
            });
            // Handle next steps or completion
            (navigation as any).navigate(ScreenEnums.BOTTOM_TABS);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={styles.title}>What number of cylinders do you have?</Text>
                        
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Number of gas cylinders</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter number of gas cylinder"
                                    placeholderTextColor={COLORS.secondaryGray}
                                    keyboardType="numeric"
                                    value={count}
                                    onChangeText={setCount}
                                />
                                <View style={styles.underline} />
                            </View>

                            <TouchableOpacity 
                                style={[styles.continueButton, (!isReady || isLoading) && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady || isLoading}
                                onPress={handleContinue}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={COLORS.primaryWhite} />
                                ) : (
                                    <Text style={styles.continueText}>Continue</Text>
                                )}
                            </TouchableOpacity>
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
        marginTop: 10,
    },
    content: {
        paddingTop: 40,
    },
    title: {
        fontSize: 23,
        fontWeight: '600',
        color: '#2F3338',
        lineHeight: 36,
        marginBottom: 48,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '500',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        backgroundColor: INPUT_BG,
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.black,
        textAlign: 'center',
    },
    underline: {
        height: 1,
        backgroundColor: UNDERLINE_COLOR,
        marginTop: -1,
        marginHorizontal: 4,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 300, // Matching the long spacing in screenshot
    },
    disabledButton: {
        opacity: 0.6,
    },
    continueText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
