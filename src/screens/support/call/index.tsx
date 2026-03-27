import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportCallScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const phoneNumber = '09026190455';

    const handleCall = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
                <Text style={styles.title}>Call Us</Text>
                <View style={{ width: 44 }} /> {/* Spacer to center title */}
            </View>

            <View style={styles.content}>
                {/* Illustration */}
                <Image 
                    source={require('../../../assets/images/rafiki.png')} 
                    style={styles.illustration}
                    resizeMode="contain"
                />

                <View style={styles.textContainer}>
                    <Text style={styles.heading}>Give us a call.</Text>
                    <Text style={styles.subtitle}>
                        Feel free to give us a dial. We'll connect you with an agent as soon as possible.
                    </Text>
                    
                    <Text style={styles.instruction}>Tap the number to call.</Text>
                    
                    <TouchableOpacity onPress={handleCall} activeOpacity={0.7}>
                        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.main_dark,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    illustration: {
        width: '100%',
        height: 280,
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 22,
        textAlign: 'center',
        fontWeight:'400',
        marginBottom: 32,
    },
    instruction: {
        fontSize: 14,
        color: COLORS.darkGray,
        marginBottom: 24,
        textAlign: 'center',
    },
    phoneNumber: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.primary, // Using your main red/orange theme color
        textAlign: 'center',
    },
});
