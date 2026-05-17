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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import ScreenEnums from '../../../enums/screen-enums';
import { AuthStackParamList, AuthStackNavigationProp } from '../../../navigation/auth-stack/auth-stack.types';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import NavigationHeader from '../../../components/navigation-header';

export default function WelcomeScreen() {
    
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'WELCOME'>>();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            registrationToken: route.params?.registrationToken || '',
            firstName,
            lastName,
            email,
            customerType: 'HOUSEHOLD',
        };
        navigation.navigate(ScreenEnums.LOCATION, { payload } as any);
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
                        title="" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.content}>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        
                        <Image 
                            source={require('../../../assets/icons/logo.png')} 
                            style={styles.logo}
                            contentFit="contain"
                        />

                        <View style={styles.form}>
                            <View style={styles.inputSection}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Full Name"
                                    placeholderTextColor={'#2F3338'}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Provide a valid email address"
                                    placeholderTextColor={'#2F3338'}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                (!isReady || isLoading) && styles.buttonDisabled
                            ]}
                            onPress={handleContinue} 
                            activeOpacity={0.8}
                            disabled={!isReady || isLoading}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
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
    content: {
        alignItems: 'center',
        paddingTop: 20,
    },
    welcomeText: {
        fontSize: 23,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_500_medium,
        marginBottom: 18,
    },
    logo: {
        width: 140,
        height: 80,
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    inputSection: {
        marginBottom: 24,
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
        paddingTop: 40,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    continueButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
    },
});
