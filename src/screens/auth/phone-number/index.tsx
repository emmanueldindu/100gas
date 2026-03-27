import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
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
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';

export default function PhoneNumberScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const [phoneNumber, setPhoneNumber] = useState('');

    const isReady = phoneNumber.length >= 7; // Allowing 7-10 digits for flexibility

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
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
                        <Text style={styles.title}>Enter Phone Number</Text>

                        <Text style={styles.label}>Mobile Number</Text>

                        <View style={styles.inputWrapper}>
                            <View style={styles.countryPicker}>
                                <Image
                                    source={{ uri: 'https://flagcdn.com/w40/ng.png' }} // Nigeria flag
                                    style={styles.flag}
                                />
                                <Ionicons name="chevron-down" size={16} color={COLORS.black} style={styles.chevron} />
                                <Text style={styles.countryCode}>+234</Text>
                                <View style={styles.divider} />
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="000 000 000"
                                placeholderTextColor={COLORS.secondaryGray}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                            />
                        </View>
                        <View style={styles.underline} />
                    </View>

                    {/* Done Button stays inside ScrollView as per your latest change */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={[
                                styles.doneButton,
                                !isReady && styles.doneButtonDisabled
                            ]}
                            onPress={() => navigation.navigate(ScreenEnums.OTP, { phoneNumber: `+234${phoneNumber}` })}
                            activeOpacity={0.8}
                            disabled={!isReady}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        color: COLORS.secondaryGray,
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 64,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        width: 28,
        height: 20,
        borderRadius: 4,
    },
    chevron: {
        marginLeft: 8,
    },
    countryCode: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.black,
        marginLeft: 8,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 20,
        color: COLORS.black,
        fontWeight: '500',
    },
    underline: {
        height: 2,
        backgroundColor: COLORS.primary,
        marginTop: -2, // Pull up to meet the wrapper if needed, or just below
        marginHorizontal: 2,
        borderRadius: 1,
    },
    bottomContainer: {
        // paddingHorizontal: 24,
        backgroundColor: COLORS.primaryWhite,
        marginTop:15,
    },
    doneButton: {
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
        marginTop:10

    },
    doneButtonDisabled: {
        backgroundColor: COLORS.secondaryGray,
        shadowOpacity: 0,
        elevation: 0,
    },
    doneButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
