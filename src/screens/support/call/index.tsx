import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportCallScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const phoneNumber = '09026190455';

    const handleCall = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Call Us</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>How can we help you?</Text>

                <View style={styles.centerSection}>
                    <Text style={styles.heading}>Give us a call</Text>
                    <Text style={styles.subtitle}>
                        Feel free to give us a dial. We'll connect you with an agent as soon as possible.
                    </Text>
                    
                    <Text style={styles.instruction}>Tap the number to call.</Text>
                    
                    <TouchableOpacity 
                        style={styles.phonePill}
                        onPress={handleCall} 
                        activeOpacity={0.8}
                    >
                        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#2F3338',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    label: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        marginBottom: 32,
    },
    centerSection: {
        flex: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    heading: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    instruction: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 32,
        textAlign: 'center',
    },
    phonePill: {
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    phoneNumber: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: COLORS.primary,
        textAlign: 'center',
    },
});
