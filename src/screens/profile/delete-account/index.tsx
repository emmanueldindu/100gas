import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { RootStackNavigationProp } from '../../screens.types';
import ScreenEnums from '../../../enums/screen-enums';

export default function DeleteAccountScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

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
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Delete your account</Text>
                <Text style={styles.subtitle}>
                    Are you sure you want to delete your account? This action can't be undone. Contact support if you need help.
                </Text>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        activeOpacity={0.8}
                        onPress={() => {}}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.contactSupportButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT)}
                    >
                        <Text style={styles.contactSupportButtonText}>Contact Support</Text>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        lineHeight: 22,
        marginBottom: 40,
    },
    footer: {
        marginTop: 'auto',
        gap: 16,
        paddingBottom: Platform.OS === 'ios' ? 50 : 60,
    },
    deleteButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    contactSupportButton: {
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
    },
    contactSupportButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
