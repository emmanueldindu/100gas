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
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';

import { Swipeable } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface CartItemProps {
    id: number;
    name: string;
    price: string;
    image: any;
    quantity: number;
    onDelete?: (id: number) => void;
}

const CartItem = ({ id, name, price, image, quantity, onDelete }: CartItemProps) => {
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

    return (
        <View style={styles.swipeWrapper}>
            <Swipeable 
                renderRightActions={renderRightActions}
                containerStyle={styles.swipeContainer}
            >
                <View style={styles.cartItem}>
                    <View style={styles.itemImageContainer}>
                        <Image source={image} style={styles.itemImage} resizeMode="contain" />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{name}</Text>
                        <Text style={styles.itemPrice}>{price}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityBtn}>
                            <Ionicons name="remove" size={16} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityBtn}>
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
    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [items, setItems] = useState([
        { id: 1, name: '24kg Gas Cylinder', price: 'N18000', quantity: 1, image: require('../../assets/images/gasimg.png') },
        { id: 2, name: '24kg Gas Cylinder', price: 'N18000', quantity: 1, image: require('../../assets/images/gasimg.png') },
        { id: 3, name: '24kg Gas Cylinder', price: 'N18000', quantity: 1, image: require('../../assets/images/gasimg.png') },
        { id: 4, name: '24kg Gas Cylinder', price: 'N18000', quantity: 1, image: require('../../assets/images/gasimg.png') },
        { id: 5, name: '24kg Gas Cylinder', price: 'N18000', quantity: 1, image: require('../../assets/images/gasimg.png') },
    ]);

    const handleDelete = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
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
        <SafeAreaView style={styles.container} edges={['top']}>
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
                    <CartItem key={item.id} {...item} onDelete={handleDelete} />
                ))}

                {isCheckoutMode && (
                    <View style={styles.checkoutSection}>
                        {/* Delivery Address */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Address</Text>
                            <Text style={styles.sectionSubtitle}>Where do you want to receive your delivery?</Text>
                            <View style={styles.addressInputContainer}>
                                <Text style={styles.addressText}>9 Industrial Layout, Port Harcourt</Text>
                                <Ionicons name="search" size={20} color="#74757C" />
                            </View>
                            <TouchableOpacity style={styles.gpsLink}>
                                <Text style={styles.gpsLinkText}>Use GPS Location</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {/* Schedule */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Schedule</Text>
                            <View style={styles.calendarRow}>
                                {['S', 'M', 'T', 'W', 'TH', 'F', 'S'].map((day, i) => (
                                    <View key={i} style={styles.calendarDay}>
                                        <Text style={styles.dayLabel}>{day}</Text>
                                        <View style={[styles.dayCircle, i === 1 && styles.activeDayCircle]}>
                                            <Text style={[styles.dayNumber, i === 1 && styles.activeDayNumber]}>
                                                {11 + i}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Promo Code */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Promo Code</Text>
                            <Text style={styles.sectionSubtitle}>Enter promo code</Text>
                            <View style={styles.promoInputContainer}>
                                <Text style={styles.promoPlaceholder}>Enter promo code</Text>
                                <TouchableOpacity style={styles.applyButton}>
                                    <Text style={styles.applyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Summary */}
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Sum Total</Text>
                                <Text style={styles.summaryValue}>₦25,000.00</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                <Text style={styles.summaryValue}>₦4000</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Promo Code</Text>
                                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>- ₦4000</Text>
                            </View>
                            <View style={[styles.summaryRow, { marginTop: 8 }]}>
                                <Text style={styles.totalLabel}>Total to pay</Text>
                                <Text style={styles.totalValue}>₦25,000.00</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.proceedButton}
                            activeOpacity={0.8}
                            onPress={() => {}}
                        >
                            <Text style={styles.proceedText}>Proceed to Payment</Text>
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
                        <Text style={styles.checkoutText}>Check out | ₦25,000.00</Text>
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
        paddingBottom: Platform.OS === 'ios' ? 60 : 40, // Moved up a bit
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
