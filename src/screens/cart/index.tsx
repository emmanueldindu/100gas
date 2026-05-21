import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Platform,
    Dimensions,
    ActivityIndicator,
    DeviceEventEmitter,
    TextInput
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

import { Swipeable } from 'react-native-gesture-handler';
import { getCart, removeFromCart, updateQuantity, CartItem as CartItemType, createOrder, getAddressesResult, createAddressResult, clearCart } from '../../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface CartItemProps {
    id: string | number;
    name: string;
    price: string | number;
    image: any;
    quantity: number;
    onDelete?: (id: string | number) => void;
    onUpdateQuantity?: (id: string | number, qty: number) => void;
}

const CartItem = ({ id, name, price, image, quantity, onDelete, onUpdateQuantity }: CartItemProps) => {
    const renderRightActions = () => {
        return (
            <TouchableOpacity 
                style={styles.deleteAction} 
                activeOpacity={0.8}
                onPress={() => onDelete?.(id)}
            >
                <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        );
    };

    const formattedPrice = typeof price === 'number' ? `₦${price.toLocaleString()}` : price;

    return (
        <View style={styles.swipeWrapper}>
            <Swipeable 
                renderRightActions={renderRightActions}
                containerStyle={styles.swipeContainer}
            >
                <View style={styles.cartItem}>
                    <View style={styles.itemImageContainer}>
                        <Image 
                            source={
                                typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))
                                    ? { uri: image }
                                    : typeof image === 'number'
                                        ? image
                                        : require('../../assets/images/gasimg.png')
                            } 
                            style={styles.itemImage} 
                            resizeMode="contain" 
                        />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>{name}</Text>
                        <Text style={styles.itemPrice}>{formattedPrice}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                            style={styles.quantityBtn}
                            onPress={() => onUpdateQuantity?.(id, quantity - 1)}
                        >
                            <Ionicons name="remove" size={16} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity 
                            style={styles.quantityBtn}
                            onPress={() => onUpdateQuantity?.(id, quantity + 1)}
                        >
                            <Ionicons name="add" size={16} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Swipeable>
        </View>
    );
};

export default function CartScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const queryClient = useQueryClient();
    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [items, setItems] = useState<CartItemType[]>([]);
    const [addressText, setAddressText] = useState('9 Industrial Layout, Port Harcourt');
    const [selectedDayIndex, setSelectedDayIndex] = useState(1); // default index
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(4000); // promo discount amount

    const loadCart = async () => {
        const cart = await getCart();
        setItems(cart);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCart();
        }, [])
    );

    const handleDelete = async (id: string | number) => {
        await removeFromCart(id);
        loadCart();
    };

    const handleUpdateQuantity = async (id: string | number, qty: number) => {
        if (qty < 1) {
            handleDelete(id);
        } else {
            await updateQuantity(id, qty);
            loadCart();
        }
    };

    const subtotal = React.useMemo(() => {
        return items.reduce((acc, item) => {
            const numericPrice = typeof item.price === 'number' 
                ? item.price 
                : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return acc + (numericPrice * item.quantity);
        }, 0);
    }, [items]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user's existing addresses
    const { data: addressesRes } = useQuery({
        queryKey: ['addresses'],
        queryFn: getAddressesResult,
    });

    React.useEffect(() => {
        if (addressesRes?.success && Array.isArray(addressesRes.data) && addressesRes.data.length > 0) {
            const defaultAddress = addressesRes.data.find((addr: any) => addr.isDefault) || addressesRes.data[0];
            if (defaultAddress?.address) {
                setAddressText(defaultAddress.address);
            }
        }
    }, [addressesRes]);

    const getNext7Days = () => {
        const days = [];
        const dayLabels = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push({
                date: d,
                dayLabel: dayLabels[d.getDay()],
                dayNumber: d.getDate(),
            });
        }
        return days;
    };

    const handleCheckoutSubmit = async () => {
        try {
            setIsSubmitting(true);
            
            let finalAddressId = "";
            
            // Check if addressText matches any existing address
            if (addressesRes?.success && Array.isArray(addressesRes.data)) {
                const found = addressesRes.data.find((addr: any) => 
                    (addr.address || '').toLowerCase().trim() === addressText.toLowerCase().trim()
                );
                if (found) {
                    finalAddressId = found.id;
                }
            }

            // If no match, dynamically provision this address in the database!
            if (!finalAddressId) {
                const newAddressRes = await createAddressResult({
                    label: 'Delivery Location',
                    address: addressText,
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

            // Map cart items to backend format
            const orderItems = items.map(item => {
                let cylinderSize = 'KG_12_5';
                const nameLower = (item.name || '').toLowerCase();
                if (nameLower.includes('3kg')) cylinderSize = 'KG_3';
                else if (nameLower.includes('5kg')) cylinderSize = 'KG_5';
                else if (nameLower.includes('6kg')) cylinderSize = 'KG_6';
                else if (nameLower.includes('10kg')) cylinderSize = 'KG_10';
                else if (nameLower.includes('12.5')) cylinderSize = 'KG_12_5';

                return {
                    productId: item.id as string,
                    quantity: item.quantity,
                    isRefill: false,
                    cylinderSize: cylinderSize
                };
            });

            // Parse selected day from dynamic index
            const scheduleDays = getNext7Days();
            const selectedDayDate = scheduleDays[selectedDayIndex]?.date || new Date();
            // Set default delivery time to 10:00 AM local time
            selectedDayDate.setHours(10, 0, 0, 0);

            const payload = {
                addressId: finalAddressId,
                paymentMethod: 'CARD',
                scheduledDate: selectedDayDate.toISOString(),
                items: orderItems,
            };

            console.log('[Cart] Submitting order payload:', JSON.stringify(payload, null, 2));

            const response = await createOrder(payload);
            
            if (response?.success) {
                console.log('[Cart] Order created successfully:', response);
                Toast.show({
                    type: 'success',
                    text1: 'Order Placed Successfully!',
                    text2: 'Your items will be delivered soon.'
                });
                await clearCart();
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                // Broadcast cart cleared update so home FAB count updates instantly
                DeviceEventEmitter.emit('cart_updated');
                navigation.navigate('BottomTabs', { screen: 'ORDER_HISTORY' });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Checkout Failed',
                    text2: response?.error?.message || 'Order creation failed. Please try again.'
                });
            }
        } catch (error: any) {
            console.error('[Cart] Order placement error:', error);
            Toast.show({
                type: 'error',
                text1: 'Checkout Error',
                text2: error?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const deliveryFee = 4000;
    const totalToPay = Math.max(0, subtotal + deliveryFee - promoDiscount);

    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <StatusBar barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cart (0)</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Image 
                        source={require('../../assets/icons/delete.png')} 
                        style={styles.emptyIllustration}
                        resizeMode="contain"
                    />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</Text>
                    <TouchableOpacity 
                        style={styles.shopNowButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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
                <Text style={styles.headerTitle}>Cart ({items.length})</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {items.map((item) => (
                    <CartItem 
                        key={item.id} 
                        {...item} 
                        onDelete={handleDelete} 
                        onUpdateQuantity={handleUpdateQuantity}
                    />
                ))}

                {isCheckoutMode && (
                    <View style={styles.checkoutSection}>
                        {/* Delivery Address */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Address</Text>
                            <Text style={styles.sectionSubtitle}>Where do you want to receive your delivery?</Text>
                            <View style={styles.addressInputContainer}>
                                <TextInput
                                    style={styles.addressInput}
                                    value={addressText}
                                    onChangeText={setAddressText}
                                    placeholder="Enter delivery address"
                                    placeholderTextColor="#74757C"
                                />
                                <Ionicons name="search" size={20} color="#74757C" />
                            </View>
                            <TouchableOpacity 
                                style={styles.gpsLink}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setAddressText('9 Industrial Layout, Port Harcourt');
                                    Toast.show({
                                        type: 'info',
                                        text1: 'GPS Location Synced',
                                        text2: 'Set delivery address to your current device location.'
                                    });
                                }}
                            >
                                <Text style={styles.gpsLinkText}>Use GPS Location</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Schedule */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Schedule</Text>
                            <View style={styles.calendarRow}>
                                {getNext7Days().map((item, i) => (
                                    <TouchableOpacity 
                                        key={i} 
                                        style={styles.calendarDay}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedDayIndex(i)}
                                    >
                                        <Text style={styles.dayLabel}>{item.dayLabel}</Text>
                                        <View style={[styles.dayCircle, selectedDayIndex === i && styles.activeDayCircle]}>
                                            <Text style={[styles.dayNumber, selectedDayIndex === i && styles.activeDayNumber]}>
                                                {item.dayNumber}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Promo Code */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Promo Code</Text>
                            <Text style={styles.sectionSubtitle}>Enter promo code</Text>
                            <View style={styles.promoInputContainer}>
                                <TextInput
                                    style={styles.promoInput}
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                    placeholder="Enter promo code"
                                    placeholderTextColor="#74757C"
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity 
                                    style={[
                                        styles.applyButton, 
                                        promoCode.trim().length > 0 && { backgroundColor: COLORS.primary }
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        const code = promoCode.trim().toUpperCase();
                                        if (code === 'GAS30' || code === '100GAS') {
                                            setPromoDiscount(4000);
                                            Toast.show({
                                                type: 'success',
                                                text1: 'Promo Code Applied!',
                                                text2: '₦4,000 delivery fee promo discount applied.'
                                            });
                                        } else if (code.length > 0) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Code',
                                                text2: 'The promo code entered is invalid.'
                                            });
                                        }
                                    }}
                                >
                                    <Text style={styles.applyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Summary */}
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Sum Total</Text>
                                <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                <Text style={styles.summaryValue}>₦{deliveryFee.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Promo Code</Text>
                                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>- ₦{promoDiscount.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.summaryRow, { marginTop: 8 }]}>
                                <Text style={styles.totalLabel}>Total to pay</Text>
                                <Text style={styles.totalValue}>₦{totalToPay.toLocaleString()}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.proceedButton, isSubmitting && { opacity: 0.7 }]}
                            activeOpacity={0.8}
                            onPress={handleCheckoutSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.proceedText}>Proceed to Payment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {!isCheckoutMode && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.checkoutButton}
                        activeOpacity={0.8}
                        onPress={() => setIsCheckoutMode(true)}
                    >
                        <Text style={styles.checkoutText}>Check out | ₦{subtotal.toLocaleString()}</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        paddingTop: 10,
        paddingBottom: 120,
    },
    swipeWrapper: {
        marginBottom: 32,
    },
    swipeContainer: {
        overflow: 'visible',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryBlack,
    },
    itemImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#2F3338',
    },
    itemImage: {
        width: '70%',
        height: '70%',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 24,
        padding: 4,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    quantityBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginHorizontal: 16,
    },
    deleteAction: {
        width: 80,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginLeft: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 60 : 60, // Moved up a bit
        paddingTop: 16,
        backgroundColor: COLORS.primaryBlack,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    checkoutSection: {
        marginTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 16,
    },
    addressInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 12,
    },
    addressInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        height: '100%',
        paddingRight: 10,
    },
    addressText: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    gpsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    gpsLinkText: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        marginRight: 4,
    },
    calendarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    calendarDay: {
        alignItems: 'center',
    },
    dayLabel: {
        fontSize: 12,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 8,
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDayCircle: {
        backgroundColor: '#FFFFFF',
    },
    dayNumber: {
        fontSize: 14,
        fontFamily: FONT.garnet_600_semibold,
        color: '#74757C',
    },
    activeDayNumber: {
        color: '#000000',
    },
    promoInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 8,
        paddingLeft: 16,
        paddingRight: 8,
        height: 56,
    },
    promoInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        height: '100%',
        paddingRight: 10,
    },
    promoPlaceholder: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    applyButton: {
        backgroundColor: '#74757C',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 4,
    },
    applyText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FONT.garnet_600_semibold,
    },
    summaryContainer: {
        borderTopWidth: 1,
        borderTopColor: '#2F3338',
        paddingTop: 24,
        marginBottom: 32,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    summaryValue: {
        fontSize: 14,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    totalValue: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    proceedButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    proceedText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIllustration: {
        width: 200,
        height: 200,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    shopNowButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopNowText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
