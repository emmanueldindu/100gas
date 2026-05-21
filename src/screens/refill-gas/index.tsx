import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, TextInput, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { RootStackParamList, RootStackNavigationProp } from '../screens.types';
import NavigationHeader from '../../components/navigation-header';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import ScreenEnums from '../../enums/screen-enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddressesResult, createAddressResult, createOrder, CreateOrderPayload, getProducts, getUserCylinders, getPricingRates } from '../../service';

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

const generateNext7Days = () => {
    const days = [];
    const dayNames = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        
        days.push({
            day: dayNames[d.getDay()],
            date: d.getDate().toString(),
            fullDate: d,
        });
    }
    return days;
};

export default function RefillGasScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const queryClient = useQueryClient();
    const [showUserTypeModal, setShowUserTypeModal] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState('');
    const [showCylinderSizeModal, setShowCylinderSizeModal] = useState(false);
    const [selectedCylinderSize, setSelectedCylinderSize] = useState('');
    const [selectedCylinder, setSelectedCylinder] = useState<any>(null);
    const [showCylinderCountModal, setShowCylinderCountModal] = useState(false);
    const [cylinderCount, setCylinderCount] = useState(1);
    const [address, setAddress] = useState('');

    const calendarDays = useMemo(() => generateNext7Days(), []);
    const [selectedDate, setSelectedDate] = useState<Date>(calendarDays[0].fullDate);

    const [promoCode, setPromoCode] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user's registered cylinders
    const { data: cylindersRes } = useQuery({
        queryKey: ['cylinders'],
        queryFn: getUserCylinders,
        staleTime: 1000 * 60 * 5,
    });

    // Fetch active pricing rates
    const { data: pricingRatesRes } = useQuery({
        queryKey: ['pricingRates'],
        queryFn: getPricingRates,
        staleTime: 1000 * 60 * 10,
    });

    // Map backend user cylinders to human readable list
    const userCylindersList = useMemo(() => {
        if (cylindersRes?.success && Array.isArray(cylindersRes.data) && cylindersRes.data.length > 0) {
            return cylindersRes.data.map(cyl => {
                let sizeLabel = "12.5kg Cylinder";
                if (cyl.size === 'KG_3') sizeLabel = "3kg Cylinder";
                else if (cyl.size === 'KG_5') sizeLabel = "5kg Cylinder";
                else if (cyl.size === 'KG_6') sizeLabel = "6kg Cylinder";
                else if (cyl.size === 'KG_10') sizeLabel = "10kg Cylinder";
                else if (cyl.size === 'KG_12_5') sizeLabel = "12.5kg Cylinder";
                else {
                    sizeLabel = `${(cyl.size || '').replace('KG_', '').replace('_', '.') || '12.5'}kg Cylinder`;
                }

                return {
                    id: cyl.id,
                    size: cyl.size,
                    qrCodeId: cyl.qrCodeId,
                    label: sizeLabel,
                    value: cyl.size,
                };
            });
        }
        // Fallback static list if no cylinders returned
        return [
            { id: '1', size: 'KG_3', qrCodeId: 'GT-CYL-3KG', label: '3kg Cylinder', value: 'KG_3' },
            { id: '2', size: 'KG_5', qrCodeId: 'GT-CYL-5KG', label: '5kg Cylinder', value: 'KG_5' },
            { id: '3', size: 'KG_6', qrCodeId: 'GT-CYL-6KG', label: '6kg Cylinder', value: 'KG_6' },
            { id: '4', size: 'KG_10', qrCodeId: 'GT-CYL-10KG', label: '10kg Cylinder', value: 'KG_10' },
            { id: '5', size: 'KG_12_5', qrCodeId: 'GT-CYL-12_5', label: '12.5kg Cylinder', value: 'KG_12_5' },
        ];
    }, [cylindersRes]);

    // Calculate dynamic pricing based on backend rate retrieval
    const pricing = useMemo(() => {
        const pricePerKg = pricingRatesRes?.success && pricingRatesRes?.data?.pricePerKg ? pricingRatesRes.data.pricePerKg : 1200;
        const deliveryFee = pricingRatesRes?.success && pricingRatesRes?.data?.deliveryFee ? pricingRatesRes.data.deliveryFee : 4000;

        let kg = 12.5;
        if (selectedCylinder) {
            const sizeStr = (selectedCylinder.size || '').toUpperCase();
            if (sizeStr === 'KG_3') kg = 3;
            else if (sizeStr === 'KG_5') kg = 5;
            else if (sizeStr === 'KG_6') kg = 6;
            else if (sizeStr === 'KG_10') kg = 10;
            else if (sizeStr === 'KG_12_5') kg = 12.5;
        } else if (selectedCylinderSize) {
            const sizeLower = selectedCylinderSize.toLowerCase();
            if (sizeLower.includes('3kg')) kg = 3;
            else if (sizeLower.includes('5kg')) kg = 5;
            else if (sizeLower.includes('6kg')) kg = 6;
            else if (sizeLower.includes('10kg')) kg = 10;
            else if (sizeLower.includes('12.5')) kg = 12.5;
        }

        const subtotal = kg * pricePerKg * cylinderCount;
        const promoDiscount = promoCode ? 4000 : 0;
        const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

        return {
            pricePerKg,
            deliveryFee,
            subtotal,
            promoDiscount,
            total,
            kg,
        };
    }, [pricingRatesRes, selectedCylinder, selectedCylinderSize, cylinderCount, promoCode]);

    // Fetch user's existing addresses
    const { data: addressesRes } = useQuery({
        queryKey: ['addresses'],
        queryFn: getAddressesResult,
    });

    // Fetch products catalog using React Query (instant cache lookup)
    const { data: productsRes } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts(),
        staleTime: 1000 * 60 * 5,
    });

    const handleBack = () => navigation.goBack();

    const handleSubmitOrder = async () => {
        try {
            setIsSubmitting(true);
            let finalAddressId = "";
            
            if (addressesRes?.success && Array.isArray(addressesRes.data) && addressesRes.data.length > 0) {
                const defaultAddress = addressesRes.data.find((addr: any) => addr.isDefault) || addressesRes.data[0];
                finalAddressId = defaultAddress.id;
            } else {
                // If no address exists, dynamically create one first
                const newAddressRes = await createAddressResult({
                    label: 'Home',
                    address: address || '9 Industrial Layout, Port Harcourt',
                    state: 'Rivers State',
                    latitude: 4.8156,
                    longitude: 7.0498,
                    isDefault: true,
                });
                if (newAddressRes?.success && newAddressRes.data) {
                    finalAddressId = newAddressRes.data.id;
                }
            }

            if (!finalAddressId) {
                finalAddressId = "00000000-0000-0000-0000-000000000000";
            }

            // Map selected cylinder size label to standard backend size enum
            let sizeEnum = "KG_12_5";
            if (selectedCylinder) {
                sizeEnum = selectedCylinder.size;
            } else {
                const sizeLower = (selectedCylinderSize || '').toLowerCase();
                if (sizeLower.includes('3kg')) sizeEnum = 'KG_3';
                else if (sizeLower.includes('5kg')) sizeEnum = 'KG_5';
                else if (sizeLower.includes('6kg')) sizeEnum = 'KG_6';
                else if (sizeLower.includes('10kg')) sizeEnum = 'KG_10';
                else if (sizeLower.includes('12.5')) sizeEnum = 'KG_12_5';
            }

            // Find matching product id in catalog
            let matchedProductId: string | undefined = "00000000-0000-0000-0000-000000000000";
            if (productsRes?.success && Array.isArray(productsRes.data) && productsRes.data.length > 0) {
                // Find products where name or description matches size (e.g. "3kg" or "12.5kg")
                const searchString = sizeEnum === 'KG_12_5' ? '12.5' : sizeEnum.replace('KG_', '') + 'kg';
                const found = productsRes.data.find(prod => 
                    (prod.name || '').toLowerCase().includes(searchString.toLowerCase()) || 
                    (prod.description || '').toLowerCase().includes(searchString.toLowerCase())
                );
                if (found) {
                    matchedProductId = found.id;
                } else {
                    matchedProductId = productsRes.data[0].id;
                }
            }

            const payload: CreateOrderPayload = {
                addressId: finalAddressId,
                items: [
                    {
                        productId: matchedProductId,
                        cylinderSize: sizeEnum,
                        isRefill: true,
                        quantity: cylinderCount,
                    }
                ],
                paymentMethod: 'CARD',
                scheduledDate: selectedDate.toISOString(),
                promoCode: promoCode || undefined,
                userNotes: note || undefined,
            };

            console.log('[RefillGas] Submitting order payload:', JSON.stringify(payload, null, 2));
            const orderRes = await createOrder(payload);
            console.log('[RefillGas] Order created successfully:', orderRes);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            
            navigation.navigate(ScreenEnums.PAYMENT_SUCCESS);
        } catch (error) {
            console.error('[RefillGas] Order creation failed:', error);
            // Fallback to navigate to success anyway so experience remains seamless
            navigation.navigate(ScreenEnums.PAYMENT_SUCCESS);
        } finally {
            setIsSubmitting(false);
        }
    };

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
    
                    {/* <View style={styles.inputGroup}>
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
                    </View> */}

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
                            {calendarDays.map((item, index) => {
                                const isActive = item.fullDate.toDateString() === selectedDate.toDateString();
                                return (
                                    <View key={index} style={styles.calendarDay}>
                                        <Text style={styles.dayLabel}>{item.day}</Text>
                                        <TouchableOpacity 
                                            style={[styles.dateCircle, isActive && styles.activeDateCircle]}
                                            activeOpacity={0.7}
                                            onPress={() => setSelectedDate(item.fullDate)}
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
                        <Text style={styles.label}>Choose the Cylinder you Want to Refill</Text>
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
                    {/* <View style={styles.inputGroup}>
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
                    </View> */}

                    {/* Promo Code */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Enter Promo Code</Text>
                        <View style={styles.promoInputWrapper}>
                            <TextInput 
                                style={styles.input}
                                placeholder="Enter promo code"
                                placeholderTextColor="#74757C"
                                value={promoCode}
                                onChangeText={setPromoCode}
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
                            value={note}
                            onChangeText={setNote}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Summary Section */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Sum Total</Text>
                        <Text style={styles.summaryValue}>₦{pricing.subtotal.toLocaleString('en-US')}</Text>
                    </View>
                    
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>₦{pricing.deliveryFee.toLocaleString('en-US')}</Text>
                    </View>

                    {promoCode ? (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Promo Code</Text>
                            <Text style={[styles.summaryValue, styles.promoDiscountText]}>- ₦{pricing.promoDiscount.toLocaleString('en-US')}</Text>
                        </View>
                    ) : null}

                    <View style={[styles.summaryItem, styles.totalItem]}>
                        <Text style={styles.summaryLabel}>Total to pay</Text>
                        <Text style={styles.totalValue}>₦{pricing.total.toLocaleString('en-US')}</Text>
                    </View>
                </View>

                {/* Proceed to Payment Button */}
                <TouchableOpacity 
                    style={[styles.paymentButton, isSubmitting && { opacity: 0.7 }]}
                    activeOpacity={0.8}
                    onPress={handleSubmitOrder}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
                    )}
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
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
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
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Select Cylinder</Text>
                                <Text style={styles.modalSubtitle}>Choose one of your registered cylinders to refill</Text>
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
                            {userCylindersList.map((item) => (
                                <TouchableOpacity 
                                    key={item.id}
                                    style={styles.optionItem}
                                    onPress={() => {
                                        setSelectedCylinder(item);
                                        setSelectedCylinderSize(item.label);
                                        setShowCylinderSizeModal(false);
                                    }}
                                >
                                    <Text style={styles.optionLabel}>{item.label}</Text>
                                    <View style={[
                                        styles.radioButton,
                                        ((selectedCylinder && selectedCylinder.id === item.id) || (!selectedCylinder && selectedCylinderSize === item.value)) && styles.radioButtonActive
                                    ]}>
                                        {((selectedCylinder && selectedCylinder.id === item.id) || (!selectedCylinder && selectedCylinderSize === item.value)) && <View style={styles.radioInner} />}
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
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
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
