import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../service/auth';

interface InfoItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onEdit?: () => void;
}

const InfoItem = ({ icon, value, onEdit }: InfoItemProps) => (
    <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
            <Ionicons name={icon} size={22} color={COLORS.darkGray} />
            <Text style={styles.infoText}>{value}</Text>
        </View>
        {onEdit && (
            <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        )}
    </View>
);

const SkeletonItem = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <View style={styles.infoItem}>
            <View style={styles.infoItemLeft}>
                <Animated.View style={[styles.skeletonIcon, { opacity }]} />
                <Animated.View style={[styles.skeletonText, { opacity }]} />
            </View>
            <Animated.View style={[styles.skeletonEdit, { opacity }]} />
        </View>
    );
};

export default function PersonalInfoScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    const { data: profileResponse, isLoading, isError } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const user = profileResponse?.data;
    const firstName = user?.firstName === 'User' ? '' : (user?.firstName || '');
    const lastName = user?.lastName === 'None' ? '' : (user?.lastName || '');
    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <SafeAreaViewContext style={styles.container} edges={['top']}>
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
                <Text style={styles.title}>Personal Info</Text>

                {isLoading ? (
                    <View style={styles.infoList}>
                        <SkeletonItem />
                        <View style={styles.separator} />
                        <SkeletonItem />
                        <View style={styles.separator} />
                        <SkeletonItem />
                        <View style={styles.separator} />
                    </View>
                ) : isError ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>Failed to load profile. Please try again.</Text>
                    </View>
                ) : (
                    <View style={styles.infoList}>
                        <InfoItem 
                            icon="person-outline" 
                            value={fullName || 'Not set'} 
                            onEdit={() => navigation.navigate(ScreenEnums.UPDATE_NAME)}
                        />
                        <View style={styles.separator} />
                        
                        <InfoItem 
                            icon="phone-portrait-outline" 
                            value={user?.phone || 'Not set'} 
                        />
                        <View style={styles.separator} />

                        <InfoItem 
                            icon="mail-outline" 
                            value={user?.email || 'Not set'} 
                            onEdit={() => navigation.navigate(ScreenEnums.UPDATE_EMAIL)}
                        />
                        <View style={styles.separator} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaViewContext>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    skeletonIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#F0F0F0',
    },
    skeletonText: {
        width: 150,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#F0F0F0',
    },
    skeletonEdit: {
        width: 40,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#F0F0F0',
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 40,
    },
    infoList: {
        gap: 2,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoText: {
        fontSize: 16,
        color: COLORS.main_dark,
        fontWeight: '400',
    },
    editText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        width: '100%',
    },
});
