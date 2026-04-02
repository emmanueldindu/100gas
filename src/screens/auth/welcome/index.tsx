import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import ScreenEnums from '../../../enums/screen-enums';
import { AuthStackParamList, AuthStackNavigationProp } from '../../../navigation/auth-stack/auth-stack.types';
import { COLORS } from '../../../constants/colors';

const INPUT_BG = '#F5F4F7';

export default function WelcomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'WELCOME'>>();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const isReady = name.trim().length > 0 && validateEmail(email);

    const handleContinue = () => {
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ') || '';

        const payload = {
            registrationToken: route.params?.registrationToken || '0000', // Ensure a fallback if token is missing
            firstName: firstName || '',
            lastName: lastName || '',
            email,
            customerType: 'HOUSEHOLD', // Default value
        };
        navigation.navigate(ScreenEnums.LOCATION, { payload } as any);
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
                    <View style={styles.content}>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        
                        <Image 
                            source={require('../../../assets/icons/logoblack.png')} 
                            style={styles.logo}
                            contentFit="contain"
                        />

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Full Name"
                                        placeholderTextColor={COLORS.secondaryGray}
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                                <View style={styles.underline} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Provide a valid email address"
                                        placeholderTextColor={COLORS.secondaryGray}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={styles.underline} />
                            </View>

                            <TouchableOpacity 
                                style={[styles.continueButton, !isReady && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady}
                                onPress={handleContinue}
                            >
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.line} />
                                <Text style={styles.orText}>or</Text>
                                <View style={styles.line} />
                            </View>

                            <TouchableOpacity 
                                style={styles.googleButton}
                                activeOpacity={0.7}
                            >
                                <Image 
                                    source={require('../../../assets/icons/google.png')} 
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.googleText}>Continue with Google</Text>
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
    content: {
        alignItems: 'center',
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 24,
        color: '#74757C',
        fontWeight: '400',
        marginBottom: 16,
    },
    logo: {
        width: 120,
        height: 80,
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: COLORS.secondaryBlack,
        marginBottom: 8,
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: INPUT_BG,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    input: {
        fontSize: 16,
        color: COLORS.black,
        textAlign: 'center',
    },
    underline: {
        height: 1,
        backgroundColor: '#DD5844',
        // opacity: 0.3,
        marginTop: -1,
        marginHorizontal: 4,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
    continueText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 16,
        color: COLORS.secondaryGray,
        fontSize: 16,
    },
    googleButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#74757C',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    googleText: {
        color: '#74757C',
        fontSize: 16,
        fontWeight: '500',
    },
});
