import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, Pressable } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

interface ListItemProps {
    title: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    customIcon?: React.ReactNode;
    isDestructive?: boolean;
    hasSeparator?: boolean;
    onPress?: () => void;
}

const ListItem = ({ title, iconName, customIcon, isDestructive, hasSeparator = true, onPress }: ListItemProps) => (
    <TouchableOpacity 
        style={[styles.listItem, hasSeparator && styles.separator]} 
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={styles.iconContainer}>
            {/* User will replace these icons later */}
            {customIcon ? (
                customIcon
            ) : iconName ? (
                <Ionicons 
                    name={iconName} 
                    size={22} 
                    color={isDestructive ? COLORS.error : COLORS.darkGray} 
                />
            ) : (
                <View style={styles.iconPlaceholder} />
            )}
        </View>
        <Text style={[styles.listItemText, isDestructive && styles.destructiveText]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

export default function ProfileScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const toggleModal = () => setIsUploadModalVisible(!isUploadModalVisible);
    const toggleLogoutModal = () => setIsLogoutModalVisible(!isLogoutModalVisible);

    return (
        <SafeAreaViewContext style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Profile Header section */}
                <View style={styles.profileHeader}>
                    <TouchableOpacity 
                        style={styles.avatarContainer}
                        onPress={toggleModal}
                        activeOpacity={0.8}
                    >
                        {/* Placeholder for the avatar image */}
                        <Image 
                            source={{ uri: 'https://i.pravatar.cc/150?u=miracle' }} 
                            style={styles.avatar} 
                        />
                    </TouchableOpacity>
                    <Text style={styles.profileName}>Miracle Emeka</Text>
                </View>

                {/* List Items */}
                <View style={styles.listContainer}>
                    
                    <ListItem 
                        title="Personal Info" 
                        iconName="person-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.PERSONAL_INFO)}
                    />

                    <SectionHeader title="Saved places" />
                    <ListItem 
                        title="Enter home location" 
                        iconName="home-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_LOCATION)}
                    />
{/* 
                    <SectionHeader title="Gas cylinder details" />
                    <ListItem 
                        title="Gas cylinder size" 
                        customIcon={<MaterialCommunityIcons name="propane-tank-outline" size={22} color={COLORS.darkGray} />}
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_CYLINDER)}
                    /> */}

                    <SectionHeader title="Offers and pomo" />
                    <ListItem 
                        title="Offers and promo" 
                        iconName="gift-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.OFFERS_AND_PROMOS)}
                    />

                    <View style={styles.spacingMedium} />

                    <ListItem 
                        title="Support" 
                        iconName="headset-outline" 
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT)}
                    />
                    
                    <ListItem 
                        title="Logout" 
                        iconName="log-out-outline" 
                        onPress={toggleLogoutModal}
                    />

                    <ListItem 
                        title="Delete Account" 
                        iconName="trash-outline" 
                        isDestructive 
                        hasSeparator={false} 
                        onPress={() => navigation.navigate(ScreenEnums.DELETE_ACCOUNT)}
                    />

                </View>
            </ScrollView>

            {/* Upload Photo Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isUploadModalVisible}
                onRequestClose={toggleModal}
            >
                <Pressable style={styles.modalOverlay} onPress={toggleModal}>
                    <Pressable style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Upload Photo</Text>
                            <TouchableOpacity onPress={toggleModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={24} color={COLORS.main_dark} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalOptions}>
                            <TouchableOpacity style={styles.modalOption} activeOpacity={0.7} onPress={toggleModal}>
                                <Image 
                                    source={require('../../assets/icons/take-photo.png')} 
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Take Photo</Text>
                            </TouchableOpacity>

                            <View style={styles.modalSeparator} />

                            <TouchableOpacity style={styles.modalOption} activeOpacity={0.7} onPress={toggleModal}>
                                <Image 
                                    source={require('../../assets/icons/choose-photos.png')} 
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Choose from Photos</Text>
                            </TouchableOpacity>

                            <View style={styles.modalSeparator} />

                            <TouchableOpacity style={styles.modalOption} activeOpacity={0.7} onPress={toggleModal}>
                                <Image 
                                    source={require('../../assets/icons/choose-file.png')} 
                                    style={styles.optionIcon}
                                />
                                <Text style={styles.optionText}>Choose from Files</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Logout Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isLogoutModalVisible}
                onRequestClose={toggleLogoutModal}
            >
                <Pressable style={styles.logoutModalOverlay} onPress={toggleLogoutModal}>
                    <Pressable style={styles.logoutModalContent}>
                        <View style={styles.logoutModalHeader}>
                            <Text style={styles.logoutModalTitle}>Logout</Text>
                            <TouchableOpacity onPress={toggleLogoutModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={24} color={COLORS.main_dark} />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.logoutSubtitle}>Are you sure you want to log out?</Text>

                        <View style={styles.logoutButtons}>
                            <TouchableOpacity 
                                style={styles.logoutConfirmButton}
                                activeOpacity={0.8}
                                onPress={async () => {
                                    toggleLogoutModal();
                                    try {
                                        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
                                    } catch (e) {
                                        console.error('Logout error:', e);
                                    }
                                    // Reset stack to prevent navigating back to protected screens
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'INFO' }],
                                        })
                                    );
                                }}
                            >
                                <Text style={styles.logoutConfirmButtonText}>Log out</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.logoutCancelButton}
                                activeOpacity={0.8}
                                onPress={toggleLogoutModal}
                            >
                                <Text style={styles.logoutCancelButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaViewContext>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 12,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 28,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 12,
    },
    iconPlaceholder: {
        width: 22,
        height: 22,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
    },
    listItemText: {
        fontSize: 16,
        color: COLORS.main_dark,
        fontWeight: '400',
    },
    destructiveText: {
        color: COLORS.error,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginTop: 24,
        marginBottom: 4,
    },
    spacingMedium: {
        height: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: COLORS.primaryWhite,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    modalOptions: {
        gap: 4,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    optionIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
        resizeMode: 'contain',
    },
    optionText: {
        fontSize: 16,
        color: COLORS.main_dark,
        fontWeight: '400',
    },
    modalSeparator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        width: '100%',
    },
    logoutModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoutModalContent: {
        backgroundColor: COLORS.primaryWhite,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    logoutModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoutModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    logoutSubtitle: {
        fontSize: 15,
        color: COLORS.darkGray,
        marginBottom: 32,
    },
    logoutButtons: {
        gap: 12,
    },
    logoutConfirmButton: {
        backgroundColor: COLORS.primary,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutConfirmButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    logoutCancelButton: {
        backgroundColor: COLORS.primaryWhite,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    logoutCancelButtonText: {
        color: COLORS.main_dark,
        fontSize: 16,
        fontWeight: '600',
    },
});
