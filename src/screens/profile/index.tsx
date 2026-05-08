import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

interface MenuItemProps {
    title: string;
    icon: any;
    onPress: () => void;
    isDestructive?: boolean;
}

const MenuItem = ({ title, icon, onPress, isDestructive }: MenuItemProps) => (
    <TouchableOpacity 
        style={styles.menuItem} 
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={[styles.menuIcon, isDestructive && { tintColor: COLORS.error }]} />
            </View>
            <Text style={[styles.menuItemText, isDestructive && styles.destructiveText]}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={isDestructive ? COLORS.error : '#74757C'} />
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

export default function ProfileScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

    const toggleLogoutModal = () => setIsLogoutModalVisible(!isLogoutModalVisible);
    const toggleUploadModal = () => setIsUploadModalVisible(!isUploadModalVisible);

    const handleLogout = async () => {
        toggleLogoutModal();
        try {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
        } catch (e) {
            console.error('Logout error:', e);
        }
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'INFO' }],
            })
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header with #1E1E1E background */}
            <SafeAreaView style={styles.headerBackground} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.avatarWrapper} 
                        activeOpacity={0.8}
                        onPress={toggleUploadModal}
                    >
                        <Image 
                            source={require('../../assets/images/user.png')} 
                            style={styles.avatar} 
                        />
                        <View style={styles.editBadge}>
                            <Image 
                                source={require('../../assets/icons/profile/camera.png')} 
                                style={styles.cameraIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Miracle Emeka</Text>
                        <Text style={styles.userEmail}>miracleemeka@gmail.com</Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Personal Details Section */}
                <View style={styles.section}>
                    <SectionHeader title="Personal Details" />
                    <MenuItem 
                        title="Personal Info" 
                        icon={require('../../assets/icons/profile/profile.png')}
                        onPress={() => navigation.navigate(ScreenEnums.PERSONAL_INFO)}
                    />
                    <MenuItem 
                        title="Address" 
                        icon={require('../../assets/icons/profile/address.png')}
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_LOCATION)}
                    />
                </View>

                {/* Gas Cylinder Setup Section */}
                <View style={styles.section}>
                    <SectionHeader title="Gas Cylinder Setup" />
                    <MenuItem 
                        title="Customer Type" 
                        icon={require('../../assets/icons/profile/customer-type.png')}
                        onPress={() => {}} // Navigate to customer type
                    />
                    <MenuItem 
                        title="Number of Gas Cylinder" 
                        icon={require('../../assets/icons/profile/number.png')}
                        onPress={() => {}} // Navigate to cylinder count
                    />
                    <MenuItem 
                        title="Size of Gas Cylinder" 
                        icon={require('../../assets/icons/profile/size.png')}
                        onPress={() => navigation.navigate(ScreenEnums.UPDATE_CYLINDER)}
                    />
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <SectionHeader title="Account" />
                    <MenuItem 
                        title="Offers and promo" 
                        icon={require('../../assets/icons/profile/offers.png')}
                        onPress={() => navigation.navigate(ScreenEnums.OFFERS_AND_PROMOS)}
                    />
                    <MenuItem 
                        title="Support" 
                        icon={require('../../assets/icons/profile/support.png')}
                        onPress={() => navigation.navigate(ScreenEnums.SUPPORT)}
                    />
                    <MenuItem 
                        title="Logout" 
                        icon={require('../../assets/icons/profile/logout.png')}
                        onPress={toggleLogoutModal}
                    />
                    <MenuItem 
                        title="Delete Account" 
                        icon={require('../../assets/icons/profile/delete.png')}
                        onPress={() => navigation.navigate(ScreenEnums.DELETE_ACCOUNT)}
                        isDestructive
                    />
                </View>
            </ScrollView>

            {/* Upload Photo Modal */}
            <Modal
                visible={isUploadModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleUploadModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={toggleUploadModal} 
                    >
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHeader}>
                            <Text style={styles.bottomSheetTitle}>Upload Photo</Text>
                            <TouchableOpacity onPress={toggleUploadModal} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.uploadOptions}>
                            <TouchableOpacity style={styles.uploadOption} activeOpacity={0.7} onPress={toggleUploadModal}>
                                <Ionicons name="camera-outline" size={24} color="#74757C" style={styles.optionIcon} />
                                <Text style={styles.optionLabel}>Take Photo</Text>
                            </TouchableOpacity>
                            <View style={styles.optionDivider} />
                            
                            <TouchableOpacity style={styles.uploadOption} activeOpacity={0.7} onPress={toggleUploadModal}>
                                <Ionicons name="images-outline" size={24} color="#74757C" style={styles.optionIcon} />
                                <Text style={styles.optionLabel}>Choose from Photos</Text>
                            </TouchableOpacity>
                            <View style={styles.optionDivider} />

                            <TouchableOpacity style={styles.uploadOption} activeOpacity={0.7} onPress={toggleUploadModal}>
                                <Ionicons name="folder-outline" size={24} color="#74757C" style={styles.optionIcon} />
                                <Text style={styles.optionLabel}>Choose from Files</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isLogoutModalVisible}
                onRequestClose={toggleLogoutModal}
            >
                <Pressable style={styles.logoutModalOverlay} onPress={toggleLogoutModal}>
                    <View style={styles.logoutModalContent}>
                        <Text style={styles.logoutModalTitle}>Logout</Text>
                        <Text style={styles.logoutModalSubtitle}>Are you sure you want to log out from your account?</Text>
                        
                        <View style={styles.logoutModalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]} 
                                onPress={toggleLogoutModal}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]} 
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
    },
    headerBackground: {
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#2F3338',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#DD5844',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1E1E1E',
    },
    cameraIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: '#FFFFFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    menuItemText: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    destructiveText: {
        color: COLORS.error,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomSheet: {
        backgroundColor: '#2F3338',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 50,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    bottomSheetTitle: {
        fontSize: 22,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadOptions: {
        gap: 0,
    },
    uploadOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    optionIcon: {
        marginRight: 16,
    },
    optionLabel: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    optionDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    logoutModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logoutModalContent: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    logoutModalTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    logoutModalSubtitle: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    logoutModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#2F3338',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
