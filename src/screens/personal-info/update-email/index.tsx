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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

export default function UpdateEmailScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const [email, setEmail] = useState('');

    const isReady = email.length > 5 && email.includes('@');

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
                        <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={styles.title}>Update your email</Text>
                        
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Provide a valid email address"
                                    placeholderTextColor={COLORS.secondaryGray}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <View style={styles.underline} />
                            </View>

                            <TouchableOpacity 
                                style={[styles.updateButton, !isReady && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady}
                                onPress={() => {
                                    // Handle verification logic
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.updateText}>Verify email</Text>
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
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
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
        color: COLORS.main_dark,
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
        color: COLORS.main_dark,
        textAlign: 'center',
    },
    underline: {
        height: 1,
        backgroundColor: UNDERLINE_COLOR,
        marginTop: -1,
        marginHorizontal: 4,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 350, // Long spacing to match mockup
    },
    disabledButton: {
        opacity: 0.6,
    },
    updateText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
