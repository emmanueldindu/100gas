import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';

const PAST_ORDERS = [
    {
        title: 'April 2026',
        data: [
            {
                id: '1',
                type: 'refill',
                title: '3kg Gas Refill',
                description: '9 Trans Amadi Industrial Layout, Port Harcourt',
                price: '₦25,000',
                date: '09 April, 2026',
            },
            {
                id: '2',
                type: 'refill',
                title: '3kg Gas Refill',
                description: '9 Trans Amadi Industrial Layout, Port Harcourt',
                price: '₦25,000',
                date: '09 April, 2026',
            },
            {
                id: '3',
                type: 'items',
                title: '100-APR0021',
                description: '23 items',
                price: '₦25,000',
                date: '09 April, 2026',
            },
        ],
    },
    {
        title: 'March 2026',
        data: [
            {
                id: '4',
                type: 'refill',
                title: '3kg Gas Refill',
                description: '9 Trans Amadi Industrial Layout, Port Harcourt',
                price: '₦25,000',
                date: '09 April, 2026',
            },
            {
                id: '5',
                type: 'refill',
                title: '3kg Gas Refill',
                description: '9 Trans Amadi Industrial Layout, Port Harcourt',
                price: '₦25,000',
                date: '09 April, 2026',
            },
        ],
    },
];

const UPCOMING_ORDERS: any[] = [];

export default function OrderHistoryScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [activeTab, setActiveTab] = useState<'Past' | 'Upcoming'>('Past');

    const handleBack = () => navigation.goBack();

    const sections = activeTab === 'Past' ? PAST_ORDERS : UPCOMING_ORDERS;
    const isEmpty = sections.length === 0;

    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.orderItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ScreenEnums.DELIVERY_DETAILS, { order: item })}
        >
            <View style={styles.iconContainer}>
                {item.type === 'refill' ? (
                    <Image 
                        source={require('../../assets/images/fireicon.png')} 
                        style={styles.orderIcon} 
                    />
                ) : (
                    <View style={styles.bagIconContainer}>
                        <Ionicons name="bag-handle" size={18} color="#FFFFFF" />
                    </View>
                )}
            </View>
            
            <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderTitle}>{item.title}</Text>
                    <Text style={styles.orderPrice}>{item.price}</Text>
                </View>
                <View style={styles.orderFooter}>
                    <Text style={styles.orderDescription} numberOfLines={1}>
                        {item.description}
                    </Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Image 
                source={require('../../assets/images/empty-order.png')} 
                style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
                You haven't placed any gas orders yet.{'\n'}Start your first order in just a few taps.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Order History</Text>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Past' && styles.activeTab]} 
                    onPress={() => setActiveTab('Past')}
                >
                    <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
                    {activeTab === 'Past' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]} 
                    onPress={() => setActiveTab('Upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
                    {activeTab === 'Upcoming' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            {isEmpty ? (
                renderEmptyState()
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                />
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
    screenTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tab: {
        marginRight: 30,
        paddingVertical: 12,
        position: 'relative',
    },
    activeTab: {},
    tabText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    activeTabText: {
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: COLORS.primary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginTop: 45,
        marginBottom: 20,
        textAlign: 'center',
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 28,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    orderIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    bagIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2F3338',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderInfo: {
        flex: 1,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    orderTitle: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    orderPrice: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDescription: {
        fontSize: 13,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        flex: 1,
        marginRight: 10,
    },
    orderDate: {
        fontSize: 13,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -60, // Slight offset to look better visually
    },
    emptyImage: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        textAlign: 'center',
        lineHeight: 20,
    },
});
