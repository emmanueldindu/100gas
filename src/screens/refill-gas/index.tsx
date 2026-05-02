import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { RootStackParamList, RootStackNavigationProp } from '../screens.types';
import NavigationHeader from '../../components/navigation-header';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import ScreenEnums from '../../enums/screen-enums';

const CUSTOMER_TYPES = [
    { label: 'Household (Personal use)', value: 'Household (Personal use)' },
    { label: 'Restaurant (Commercial kitchen)', value: 'Restaurant (Commercial kitchen)' },
    { label: 'Small Depot (Reseller)', value: 'Small Depot (Reseller)' },
    { label: 'Organization (Company / Institution)', value: 'Organization (Company / Institution)' },
];

const CYLINDER_SIZES = [
    { label: '3kg Cylinder', value: '3kg Cylinder' },
    { label: '5kg Cylinder', value: '5kg Cylinder' },
    { label: '6kg Cylinder', value: '6kg Cylinder' },
    { label: '10kg Cylinder', value: '10kg Cylinder' },
    { label: '12.5kg Cylinder', value: '12.5kg Cylinder' },
];

export default function RefillGasScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [showUserTypeModal, setShowUserTypeModal] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState('');
    const [showCylinderSizeModal, setShowCylinderSizeModal] = useState(false);
    const [selectedCylinderSize, setSelectedCylinderSize] = useState('');
    const [showCylinderCountModal, setShowCylinderCountModal] = useState(false);
    const [cylinderCount, setCylinderCount] = useState(1);
    const [address, setAddress] = useState('');

    const handleBack = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <NavigationHeader 
                title="Refill Gas" 
                onBackPressAction={handleBack}
            />

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.introSection}>
                    <Text style={styles.subtitle}>Get your gas refilled without delays</Text>
                    <View style={styles.deliveryInfo}>
                        <Image 
                            source={require('../../assets/images/fireicon.png')} 
                            style={styles.fireIcon} 
                        />
                        <Text style={styles.deliveryText}>20-30 minutes delivery time</Text>
                    </View>
                </View>

                <View style={styles.illustrationContainer}>
                    <Image 
                        source={require('../../assets/images/refillimg.png')} 
                        style={styles.mainIllustration}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.formSection}>
                    {/* User Type Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What Best Describes You?</Text>
                        <TouchableOpacity 
                            style={styles.selector}
                            activeOpacity={0.7}
                            onPress={() => {
                                console.log('Opening Customer Type Modal');
                                setShowUserTypeModal(true);
                            }}
                        >
                            <Text style={[
                                styles.selectorText, 
                                !selectedUserType && styles.placeholderText
                            ]}>
                                {selectedUserType || 'Select customer type'}
                            </Text>
                            <Ionicons 
                                name="chevron-down" 
                                size={20} 
                                color="#FFFFFF" 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Address Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Where Do You Want To Receive Your Delivery?</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="9 Industrial Layout, Port Harcourt"
                                placeholderTextColor="#74757C"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <Ionicons name="search-outline" size={20} color="#74757C" style={styles.searchIcon} />
                        </View>
                        
                        <TouchableOpacity style={styles.gpsLink} activeOpacity={0.7}>
                            <Text style={styles.gpsText}>Use GPS Location</Text>
                            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Schedule Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Schedule</Text>
                        <View style={styles.calendarStrip}>
                            {[
                                { day: 'S', date: '11' },
                                { day: 'M', date: '12' },
                                { day: 'T', date: '13' },
                                { day: 'W', date: '14' },
                                { day: 'TH', date: '15' },
                                { day: 'F', date: '16' },
                                { day: 'S', date: '17' },
                            ].map((item, index) => {
                                const isActive = item.date === '12';
                                return (
                                    <View key={index} style={styles.calendarDay}>
                                        <Text style={styles.dayLabel}>{item.day}</Text>
                                        <TouchableOpacity 
                                            style={[styles.dateCircle, isActive && styles.activeDateCircle]}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.dateLabel, isActive && styles.activeDateLabel]}>{item.date}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Cylinder Size Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Choose the Size of Cylinder you Want to Refill</Text>
                        <TouchableOpacity 
                            style={styles.selector}
                            activeOpacity={0.7}
                            onPress={() => setShowCylinderSizeModal(true)}
                        >
                            <Text style={[
                                styles.selectorText, 
                                !selectedCylinderSize && styles.placeholderText
                            ]}>
                                {selectedCylinderSize || 'Select cylinder size'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Cylinder Count Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Select the Number of Cylinders to Refill</Text>
                        <TouchableOpacity 
                            style={styles.selector}
                            activeOpacity={0.7}
                            onPress={() => setShowCylinderCountModal(true)}
                        >
                            <Text style={styles.selectorText}>
                                {cylinderCount} {cylinderCount === 1 ? 'Cylinder' : 'Cylinders'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Promo Code */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Enter Promo Code</Text>
                        <View style={styles.promoInputWrapper}>
                            <TextInput 
                                style={styles.input}
                                placeholder="Enter promo code"
                                placeholderTextColor="#74757C"
                            />
                            <TouchableOpacity style={styles.applyButton} activeOpacity={0.8}>
                                <Text style={styles.applyText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Note Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Leave a note (Optional)</Text>
                        <TextInput 
                            style={styles.textArea}
                            placeholder="Please call when you arrive. House is the third building after the junction."
                            placeholderTextColor="#74757C"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Summary Section */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Sum Total</Text>
                        <Text style={styles.summaryValue}>₦25,000.00</Text>
                    </View>
                    
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>₦4000</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Promo Code</Text>
                        <Text style={[styles.summaryValue, styles.promoDiscountText]}>- ₦4000</Text>
                    </View>

                    <View style={[styles.summaryItem, styles.totalItem]}>
                        <Text style={styles.summaryLabel}>Total to pay</Text>
                        <Text style={styles.totalValue}>₦25,000.00</Text>
                    </View>
                </View>

                {/* Proceed to Payment Button */}
                <TouchableOpacity 
                    style={styles.paymentButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(ScreenEnums.PAYMENT_SUCCESS)}
                >
                    <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Customer Type Modal */}
            <Modal
                visible={showUserTypeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowUserTypeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={() => setShowUserTypeModal(false)} 
                    >
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
                    </TouchableOpacity>
                    
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Select Customer Type</Text>
                                <Text style={styles.modalSubtitle}>Choose what best describes you?</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => setShowUserTypeModal(false)}
                                style={styles.closeButton}
                            >
                                <Image source={require("../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.optionsList}>
                            {CUSTOMER_TYPES.map((item) => (
                                <TouchableOpacity 
                                    key={item.value}
                                    style={styles.optionItem}
                                    onPress={() => {
                                        setSelectedUserType(item.value);
                                        setShowUserTypeModal(false);
                                    }}
                                >
                                    <Text style={styles.optionLabel}>{item.label}</Text>
                                    <View style={[
                                        styles.radioButton,
                                        selectedUserType === item.value && styles.radioButtonActive
                                    ]}>
                                        {selectedUserType === item.value && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Cylinder Size Modal */}
            <Modal
                visible={showCylinderSizeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCylinderSizeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={() => setShowCylinderSizeModal(false)} 
                    >
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
                    </TouchableOpacity>
                    
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Select Cylinder Size</Text>
                                <Text style={styles.modalSubtitle}>Choose the size of cylinder you want to refill</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => setShowCylinderSizeModal(false)}
                                style={styles.closeButton}
                            >
                                <Image source={require("../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.optionsList}>
                            {CYLINDER_SIZES.map((item) => (
                                <TouchableOpacity 
                                    key={item.value}
                                    style={styles.optionItem}
                                    onPress={() => {
                                        setSelectedCylinderSize(item.value);
                                        setShowCylinderSizeModal(false);
                                    }}
                                >
                                    <Text style={styles.optionLabel}>{item.label}</Text>
                                    <View style={[
                                        styles.radioButton,
                                        selectedCylinderSize === item.value && styles.radioButtonActive
                                    ]}>
                                        {selectedCylinderSize === item.value && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Cylinder Count Modal */}
            <Modal
                visible={showCylinderCountModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCylinderCountModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={() => setShowCylinderCountModal(false)} 
                    >
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
                    </TouchableOpacity>
                    
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Select Number of Cylinders</Text>
                                <Text style={styles.modalSubtitle}>Bulk Orders may attract discounts</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => setShowCylinderCountModal(false)}
                                style={styles.closeButton}
                            >
                                <Image source={require("../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.counterSection}>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => setCylinderCount(prev => Math.max(1, prev - 1))}
                                >
                                    <Ionicons name="remove" size={24} color="#121212" />
                                </TouchableOpacity>
                                
                                <Text style={styles.countText}>{cylinderCount}</Text>
                                
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => setCylinderCount(prev => Math.min(10, prev + 1))}
                                >
                                    <Ionicons name="add" size={24} color="#121212" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.continueButton}
                            onPress={() => setShowCylinderCountModal(false)}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 60,
    },
    introSection: {
        marginTop: 20,
        marginBottom: 32,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireIcon: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    deliveryText: {
        fontSize: 14,
        fontFamily: FONT.garnet_300_light,
        color: '#74757C',
    },
    illustrationContainer: {
        width: '100%',
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainIllustration: {
        width: '100%',
        height: '100%',
    },
    formSection: {
        marginTop: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
        marginBottom: 12,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    selectorText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
    },
    placeholderText: {
        color: '#74757C',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#2F3338', // Slightly lighter dark for modal
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#D0D5DD',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        // backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsList: {
        marginTop: 8,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    optionLabel: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        flex: 1,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#74757C',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    radioButtonActive: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    counterSection: {
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#74757C',
        borderRadius: 30,
        paddingHorizontal: 8,
        paddingVertical: 8,
        width: 140,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 20,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
    },
    searchIcon: {
        marginLeft: 8,
    },
    gpsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    gpsText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
        marginRight: 4,
    },
    calendarStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    calendarDay: {
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 8,
    },
    dateCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDateCircle: {
        backgroundColor: '#FFFFFF',
    },
    dateLabel: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    activeDateLabel: {
        color: '#121212',
        fontFamily: FONT.garnet_600_semibold,
    },
    promoInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        paddingLeft: 16,
        paddingRight: 6,
        height: 56,
    },
    applyButton: {
        backgroundColor: '#74757C',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FONT.garnet_600_semibold,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: FONT.garnet_400_regular,
        height: 120,
    },
    summaryContainer: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: '#2F3338',
        paddingTop: 24,
    },
    summaryItem: {
        marginBottom: 24,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    promoDiscountText: {
        color: COLORS.primary,
    },
    totalItem: {
        marginTop: 8,
        marginBottom: 32,
    },
    totalValue: {
        fontSize: 28,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    paymentButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
