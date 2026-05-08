import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigationProp, RootStackParamList } from '../screens.types';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeliveryDetailsScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'DELIVERY_DETAILS'>>();
    const { order } = route.params || { order: { type: 'refill' } };

    const isItemOrder = order?.type === 'items';

    const renderDetailItem = (label: string, value: string) => (
        <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );

    const renderItemRow = (title: string, price: string, qty: number) => (
        <View style={styles.itemRow}>
            <View style={styles.itemImageContainer}>
                <Image 
                    source={require('../../assets/images/gasimg.png')} 
                    style={styles.itemImage}
                />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{title}</Text>
                <View style={styles.itemPriceQty}>
                    <Text style={styles.itemPrice}>{price}</Text>
                    <Text style={styles.itemQtyDivider}> | </Text>
                    <Text style={styles.itemQty}>Qty: {qty}</Text>
                </View>
            </View>
        </View>
    );

    const renderSummaryItem = (label: string, value: string, isTotal?: boolean) => (
        <View style={[styles.summaryItem, isTotal && styles.totalItem]}>
            <Text style={[styles.summaryLabel, isTotal && styles.totalLabel]}>{label}</Text>
            <Text style={[styles.summaryValue, isTotal && styles.totalValueText]}>{value}</Text>
        </View>
    );

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
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isItemOrder ? 'Order Details' : 'Gas Refill Details'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {isItemOrder ? (
                    <>
                        <View style={styles.itemsList}>
                            {renderItemRow('24kg Gas Cylinder', '₦18,000', 1)}
                            {renderItemRow('24kg Gas Cylinder', '₦18,000', 1)}
                            {renderItemRow('24kg Gas Cylinder', '₦18,000', 1)}
                        </View>

                        <View style={styles.divider} />

                        {renderDetailItem('Delivery Address', order.description || '9 Trans Amadi Industrial Layout, Port Harcourt')}
                        {renderDetailItem('Delivery Date and Time', order.date || '09 April, 2026, 10:09 AM')}

                        <View style={styles.summarySection}>
                            {renderSummaryItem('Sum Total', '₦25,000.00')}
                            {renderSummaryItem('Delivery Fee', '₦4000')}
                            {renderSummaryItem('Total to pay', '₦25,000.00', true)}
                        </View>

                        <TouchableOpacity style={styles.reorderButton} activeOpacity={0.8}>
                            <Text style={styles.reorderButtonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {renderDetailItem('Delivery Address', order.description || '9 Trans Amadi Industrial Layout, Port Harcourt')}
                        {renderDetailItem('Delivery Date and Time', order.date || '09 April, 2026, 10:09 AM')}
                        {renderDetailItem('Cylinder Size', '3kg Cylinder')}
                        {renderDetailItem('Number of Cylinders', '4 Cylinders')}
                        {renderDetailItem('Delivery Instructions', 'Please call when you arrive. House is the third building after the junction.')}

                        <View style={styles.divider} />

                        <View style={styles.amountSection}>
                            <Text style={styles.amountLabel}>Amount Paid</Text>
                            <Text style={styles.amountValue}>₦25,000.00</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.reorderButton} activeOpacity={0.8}>
                                <Text style={styles.reorderButtonText}>Reorder</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
                                <Text style={styles.supportButtonText}>Contact Support</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
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
        paddingVertical: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    itemsList: {
        marginBottom: 20,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    itemImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 4,
    },
    itemPriceQty: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    itemQtyDivider: {
        fontSize: 16,
        color: '#74757C',
    },
    itemQty: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    detailSection: {
        marginBottom: 28,
    },
    detailLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 8,
    },
    detailValue: {
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
        color: '#FFFFFF',
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 12,
        marginBottom: 30,
    },
    summarySection: {
        marginTop: 10,
        marginBottom: 40,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    summaryValue: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    totalItem: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    totalValueText: {
        fontSize: 20,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
    },
    amountSection: {
        marginTop: 20,
        marginBottom: 40,
    },
    amountLabel: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 8,
    },
    amountValue: {
        fontSize: 24,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
    },
    buttonContainer: {
        gap: 16,
    },
    reorderButton: {
        height: 56,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reorderButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    supportButton: {
        height: 56,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    supportButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
