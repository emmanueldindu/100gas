import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

interface SupportItemProps {
    title: string;
    icon: any;
    onPress?: () => void;
}

const SupportItem = ({ title, icon, onPress }: SupportItemProps) => (
    <TouchableOpacity 
        style={styles.supportItem} 
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={styles.supportItemLeft}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.supportItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#74757C" />
    </TouchableOpacity>
);

export default function SupportScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.label}>How can we help you?</Text>

                <View style={styles.supportList}>
                    <SupportItem 
                        title="Chat With Us" 
                        icon={require('../../assets/icons/chat.png')} 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_CHAT)}
                    />
                    <View style={styles.divider} />
                    <SupportItem 
                        title="Call Us" 
                        icon={require('../../assets/icons/callus.png')} 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_CALL)}
                    />
                    <View style={styles.divider} />
                    <SupportItem 
                        title="FAQs" 
                        icon={require('../../assets/icons/faqs.png')} 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT_FAQS)}
                    />
                    <View style={styles.divider} />
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    label: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        marginBottom: 32,
    },
    supportList: {
        gap: 0,
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    supportItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    supportItemText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
});
