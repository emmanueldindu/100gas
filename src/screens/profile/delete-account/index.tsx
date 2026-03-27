import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';
import ScreenEnums from '../../../enums/screen-enums';

export default function DeleteAccountScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Delete your account</Text>
                <Text style={styles.subtitle}>
                    Are you sure you want to delete your account? This action can't be undone. Contact support if you need help.
                </Text>

                <View style={styles.bottomButtons}>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            // Handle delete account logic here
                        }}
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
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        borderColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 22,
        marginBottom: 40,
    },
    bottomButtons: {
        marginTop: 'auto', // Pushes buttons to the bottom
        gap: 16,
    },
    deleteButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    contactSupportButton: {
        backgroundColor: COLORS.primaryWhite,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    contactSupportButtonText: {
        color: COLORS.main_dark,
        fontSize: 16,
        fontWeight: '600',
    },
});
