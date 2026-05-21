import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../service';

interface InfoItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onPress?: () => void;
}

const InfoItem = ({ icon, value, onPress }: InfoItemProps) => (
    <TouchableOpacity 
        style={styles.infoItem} 
        activeOpacity={0.7} 
        onPress={onPress}
    >
        <View style={styles.infoItemLeft}>
            <Ionicons name={icon} size={22} color="#74757C" />
            <Text style={styles.infoText}>{value}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#74757C" />
    </TouchableOpacity>
);

export default function PersonalInfoScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5,
    });

    const user = profileResponse?.data;
    const fullName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Miracle Emeka';
    const phone = user?.phone || '+2349026190455';
    const email = user?.email || 'miracleemeka@gmail.com';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Info</Text>
                <View style={{ width: 44 }} /> {/* Spacer for centering */}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>How can we help you?</Text>

                <View style={styles.infoList}>
                    <InfoItem 
                        icon="person-outline" 
                        value={fullName} 
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_NAME)}
                    />
                    <View style={styles.separator} />
                    
                    <InfoItem 
                        icon="call-outline" 
                        value={phone} 
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_PHONE)}
                    />
                    <View style={styles.separator} />

                    <InfoItem 
                        icon="mail-outline" 
                        value={email} 
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_EMAIL)}
                    />
                    <View style={styles.separator} />
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
    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        marginBottom: 48,
    },
    infoList: {
        marginTop: 10,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    infoItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        width: '100%',
    },
});
