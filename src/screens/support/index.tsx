import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

interface SupportItemProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
}

const SupportItem = ({ title, icon, onPress }: SupportItemProps) => (
    <TouchableOpacity 
        style={styles.supportItem} 
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={styles.supportItemLeft}>
            <Ionicons name={icon} size={24} color={COLORS.main_dark} />
            <Text style={styles.supportItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryGray} />
    </TouchableOpacity>
);

export default function SupportScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Support</Text>
                <Text style={styles.subtitle}>How can we help you?</Text>

                <View style={styles.supportList}>
                    <SupportItem 
                        title="Chat With Us" 
                        icon="chatbubble-ellipses-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_CHAT)}
                    />
                    <SupportItem 
                        title="Call Us" 
                        icon="call-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_CALL)}
                    />
                    <SupportItem 
                        title="FAQs" 
                        icon="help-circle-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_FAQS)}
                    />
                </View>
            </ScrollView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
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
        borderColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginBottom: 32,
    },
    supportList: {
        marginTop: 8,
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    supportItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    supportItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.main_dark,
    },
});
