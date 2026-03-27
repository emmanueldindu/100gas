import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import { COLORS } from '../../constants/colors';

export default function DeliverySummaryScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    const handleBack = () => {
        navigation.goBack();
    };

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

                {/* Title */}
                <Text style={styles.title}>Delivery Summary</Text>

                {/* Delivery Address Section with Map */}
                <View style={styles.section}>
                    <View style={styles.addressContainer}>
                        <Image 
                            source={require('../../assets/icons/map.png')} 
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                        <View style={styles.addressInfo}>
                            <Text style={styles.sectionTitle}>Delivery address</Text>
                            <Text style={styles.addressText}>Mercyland Estate, New GRA</Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.linkText}>Change Address</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Delivery Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery details</Text>
                    <Text style={styles.detailText}>3kg cylinder</Text>
                    <Text style={styles.detailText}>3kg gas quantity</Text>
                    <TouchableOpacity activeOpacity={0.7} style={{ marginTop: 4 }}>
                        <Text style={styles.linkText}>Change Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Refill Date Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Refill date</Text>
                    <View style={styles.datePill}>
                        <Text style={styles.datePillText}>Same Day</Text>
                    </View>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment method</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentIconContainer}>
                            <Ionicons name="list" size={24} color="#00C2FF" />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentTitle}>Bank Transfer</Text>
                            <Text style={styles.paymentSub}>Pay with Paystack</Text>
                        </View>
                    </View>
                </View>

                {/* Total Charge Section */}
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Your total charge is</Text>
                    <Text style={styles.totalPrice}>₦12,300</Text>
                </View>

                {/* Pay Now Button */}
                <TouchableOpacity style={styles.payBtn} activeOpacity={0.8}>
                    <Text style={styles.payBtnText}>Pay Now</Text>
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
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapImage: {
        width: 100,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    addressInfo: {
        flex: 1,
        marginLeft: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 6,
    },
    addressText: {
        fontSize: 15,
        color: COLORS.main_dark,
        marginBottom: 4,
    },
    linkText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.black,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 24,
    },
    detailText: {
        fontSize: 15,
        color: COLORS.darkGray, // Screenshot uses a slightly lighter gray for details
        marginBottom: 4,
    },
    datePill: {
        backgroundColor: lightOrange,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        minWidth: 110,
        alignItems: 'center',
        marginTop: 6,
    },
    datePillText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.main_dark,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInfo: {
        marginLeft: 12,
    },
    paymentTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    paymentSub: {
        fontSize: 13,
        color: COLORS.darkGray,
    },
    totalSection: {
        marginTop: 20, // Reduced from refill screen top match screenshot
        marginBottom: 30,
    },
    totalLabel: {
        fontSize: 16,
        color: COLORS.darkGray,
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 48,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    payBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    payBtnText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '700',
    },
});
