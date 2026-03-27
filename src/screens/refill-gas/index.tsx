import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { COLORS } from '../../constants/colors';

export default function RefillGasScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [quantity, setQuantity] = useState(3);
    const [selectedDate, setSelectedDate] = useState('Same Day');

    const handleBack = () => {
        navigation.goBack();
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const dates = ['Same Day', 'Next Day', '2 Days'];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Header / Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>

                {/* Title & Subtitle */}
                <Text style={styles.title}>Refill Gas</Text>
                <Text style={styles.subtitle}>
                    Get your gas refilled without delays. Review your details and proceed.
                </Text>

                {/* Delivery Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery address</Text>
                    <Text style={styles.addressText}>Mercyland Estate, New GRA</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={styles.changeAddressBtn}>Change Address</Text>
                    </TouchableOpacity>
                </View>

                {/* Gas Quantity Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gas quantity (kg)</Text>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity style={styles.quantityBtn} onPress={decreaseQuantity} activeOpacity={0.7}>
                            <Ionicons name="remove" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                        
                        <Text style={styles.quantityText}>{quantity}</Text>

                        <TouchableOpacity style={styles.quantityBtn} onPress={increaseQuantity} activeOpacity={0.7}>
                            <Ionicons name="add" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Refill Date Section */}
                <View style={[styles.section]}>
                    <Text style={styles.sectionTitle}>Select refill date</Text>
                    <View style={styles.dateOptionsContainer}>
                        {dates.map((date) => {
                            const isActive = selectedDate === date;
                            return (
                                <TouchableOpacity 
                                    key={date}
                                    style={[
                                        styles.dateOptionBtn, 
                                        isActive ? styles.dateOptionActiveRow : styles.dateOptionInactiveRow
                                    ]}
                                    onPress={() => setSelectedDate(date)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.dateOptionText,
                                        isActive ? styles.dateOptionTextActive : styles.dateOptionTextInactive
                                    ]}>
                                        {date}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Discounts Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { fontSize: 22, fontWeight: '700' }]}>Discounts</Text>
                    <Text style={styles.promoLabel}>Promo Code</Text>
                    <View style={styles.promoInputContainer}>
                        <TextInput 
                            style={styles.promoInput}
                            placeholder="Enter code"
                            placeholderTextColor="#A0A0A0"
                        />
                        <TouchableOpacity style={styles.applyBtn} activeOpacity={0.7}>
                            <Text style={styles.applyBtnText}>Apply code</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Total Charge Section */}
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Your total charge is</Text>
                    <Text style={styles.totalPrice}>₦12,300</Text>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity 
                    style={styles.confirmBtn} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(ScreenEnums.DELIVERY_SUMMARY)}
                >
                    <Text style={styles.confirmBtnText}>Confirm Order</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const lightOrange = '#FFE9E2';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 22,
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    noBorderBottom: {
        borderBottomWidth: 0,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    addressText: {
        fontSize: 15,
        color: COLORS.main_dark,
        marginBottom: 6,
    },
    changeAddressBtn: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.black, // Dark bolder text for link
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: lightOrange,
        borderRadius: 30,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginTop: 4,
    },
    quantityBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: lightOrange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.main_dark,
        marginHorizontal: 18,
    },
    dateOptionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        flexWrap: 'wrap',
        gap: 12,
    },
    dateOptionBtn: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 90,
    },
    dateOptionActiveRow: {
        backgroundColor: COLORS.primary,
    },
    dateOptionInactiveRow: {
        backgroundColor: lightOrange,
    },
    dateOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    dateOptionTextActive: {
        color: COLORS.primaryWhite,
    },
    dateOptionTextInactive: {
        color: COLORS.main_dark,
    },
    promoLabel: {
        fontSize: 15,
        color: COLORS.main_dark,
        marginBottom: 12,
        marginTop: 4,
    },
    promoInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        paddingLeft: 16,
        paddingRight: 8,
        height: 60,
    },
    promoInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.main_dark,
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    applyBtnText: {
        color: COLORS.primaryWhite,
        fontSize: 14,
        fontWeight: '600',
    },
    totalSection: {
        marginTop: 10,
        marginBottom: 30,
    },
    totalLabel: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    totalPrice: {
        fontSize: 48,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    confirmBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmBtnText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '700',
    },
});
