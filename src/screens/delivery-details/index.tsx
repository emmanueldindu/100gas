import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';

export default function DeliveryDetailsScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <SafeAreaViewContext style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Delivery Details</Text>
                </View>
                {/* Empty view for spacing to keep the title centered */}
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Location Section */}
                <View style={[styles.section, styles.borderBottom]}>
                    <Text style={styles.sectionTitle}>Delivery to Mercyland Estate</Text>
                    <Text style={styles.sectionSubtitle}>20 Mar, 10:09 AM</Text>
                </View>

                {/* Delivery details Section */}
                <View style={[styles.section, styles.borderBottom]}>
                    <Text style={[styles.sectionTitle, { marginBottom: 4 }]}>Delivery details</Text>
                    <Text style={styles.sectionText}>3kg cylinder</Text>
                    <Text style={styles.sectionText}>3kg gas quantity</Text>
                </View>

                {/* Refill date Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Refill date</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Same day</Text>
                    </View>
                </View>

                {/* Payment method Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Payment method</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentIconContainer}>
                            <Ionicons name="menu" size={24} color="#00C3F8" style={{ transform: [{ rotate: '90deg' }] }}/>
                        </View>
                        <View>
                            <Text style={styles.paymentMethodTitle}>Bank Transfer</Text>
                            <Text style={styles.paymentMethodSubtitle}>Pay with Paystack</Text>
                        </View>
                    </View>
                </View>

                {/* Total Charge Section */}
                <View style={styles.chargeSection}>
                    <Text style={styles.chargeLabel}>Your total charge is</Text>
                    <Text style={styles.chargeAmount}>₦12,300</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.primaryButton]} activeOpacity={0.8}>
                        <Text style={styles.primaryButtonText}>Contact support</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} activeOpacity={0.8}>
                        <Text style={styles.secondaryButtonText}>Contact Driver</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaViewContext>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
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
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.main_dark,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        paddingVertical: 24,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 6,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    sectionText: {
        fontSize: 15,
        color: COLORS.main_dark,
        marginBottom: 6,
    },
    badge: {
        backgroundColor: '#FFE8E4',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: COLORS.main_dark,
        fontWeight: '500',
        fontSize: 15,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.light_gray,
        borderRadius: 8,
        padding: 16,
    },
    paymentIconContainer: {
        marginRight: 16,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 4,
    },
    paymentMethodSubtitle: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    chargeSection: {
        marginTop: 10,
        marginBottom: 30,
    },
    chargeLabel: {
        fontSize: 15,
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    chargeAmount: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.main_dark,
    },
    buttonContainer: {
        gap: 16,
    },
    button: {
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    primaryButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: COLORS.primaryWhite,
        borderWidth: 1,
        borderColor: COLORS.light_gray,
    },
    secondaryButtonText: {
        color: COLORS.main_dark,
        fontSize: 16,
        fontWeight: '600',
    },
});
