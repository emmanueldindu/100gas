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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { AuthStackNavigationProp } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

export default function CylinderCountScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    
    const [count, setCount] = useState('');

    const isReady = count.length > 0;

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
                                style={[styles.continueButton, !isReady && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady}
                                onPress={() => {
                                    // Handle next steps or completion
                                    (navigation as any).navigate(ScreenEnums.BOTTOM_TABS);
                                }}
                            >
                                <Text style={styles.continueText}>Continue</Text>
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
