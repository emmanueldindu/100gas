import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, Image, TouchableOpacity, StatusBar, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import NavigationHeader from '@/src/components/navigation-header';
import { getOrders } from '../../service';
import { useQuery, useQueryClient } from '@tanstack/react-query';



export default function OrderHistoryScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [activeTab, setActiveTab] = useState<'Past' | 'Upcoming'>('Past');
    const queryClient = useQueryClient();

    // Fetch user's orders using React Query cache
    const { data: ordersRes, isLoading: queryLoading, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    });

    const orders = ordersRes?.success && Array.isArray(ordersRes.data) ? ordersRes.data : [];
    
    // Only show the shimmering skeleton loader when there is no cached data available
    const isLoading = queryLoading && orders.length === 0;

    const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.7,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(0.3);
        }
    }, [isLoading]);

    const handleBack = () => navigation.goBack();

    // Silently refetch orders in the background on every tab focus
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [])
    );

    const renderSkeletonState = () => (
        <View style={styles.skeletonContainer}>
            <Animated.View style={[styles.skeletonHeaderPlaceholder, { opacity: pulseAnim }]} />
            {[1, 2, 3].map((val) => (
                <View key={val} style={styles.skeletonItem}>
                    <Animated.View style={[styles.skeletonIcon, { opacity: pulseAnim }]} />
                    <View style={styles.skeletonInfo}>
                        <View style={styles.skeletonRow}>
                            <Animated.View style={[styles.skeletonTitle, { opacity: pulseAnim }]} />
                            <Animated.View style={[styles.skeletonPrice, { opacity: pulseAnim }]} />
                        </View>
                        <View style={[styles.skeletonRow, { marginTop: 12 }]}>
                            <Animated.View style={[styles.skeletonDesc, { opacity: pulseAnim }]} />
                            <Animated.View style={[styles.skeletonDate, { opacity: pulseAnim }]} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const mapBackendOrder = (o: any) => {
        const firstItem = o.items?.[0];
        const isRefill = firstItem?.isRefill || false;
        
        let title = "Gas Order";
        if (isRefill) {
            const size = (firstItem?.cylinderSize || 'KG_12_5').replace('KG_', '') + 'kg Cylinder Refill';
            title = size;
        } else if (firstItem?.product?.name) {
            title = firstItem.product.name;
            if (o.items.length > 1) {
                title += ` + ${o.items.length - 1} items`;
            }
        }

        const sumPrice = o.items?.reduce((acc: number, it: any) => {
            const price = it.product?.price || 25000;
            return acc + (price * it.quantity);
        }, 0) || 25000;

        const dateObj = new Date(o.scheduledDate || o.createdAt || Date.now());
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateString = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

        return {
            id: o.id || String(Math.random()),
            type: isRefill ? 'refill' : 'items',
            title: title,
            description: o.address?.address || '9 Industrial Layout, Port Harcourt',
            price: `₦${sumPrice.toLocaleString()}`,
            date: dateString,
            status: o.status || 'PENDING',
            raw: o
        };
    };

    const getSections = () => {
        const mapped = orders.map(mapBackendOrder);
        const filtered = mapped.filter((o: any) => {
            const isUpcoming = ['PENDING', 'IN_PROGRESS', 'ACCEPTED', 'PROCESSING', 'ASSIGNED'].includes(String(o.status).toUpperCase());
            return activeTab === 'Upcoming' ? isUpcoming : !isUpcoming;
        });

        const groups: { [key: string]: any[] } = {};
        filtered.forEach((o: any) => {
            const parts = o.date.split(' ');
            const monthYear = parts.length >= 3 ? `${parts[1]} ${parts[2]}` : 'Recent Orders';
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(o);
        });

        return Object.keys(groups).map(key => ({
            title: key,
            data: groups[key]
        }));
    };

    const sections = getSections();
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
            <NavigationHeader
                title='Order History'
                hideNavigation 
            />

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

            {isLoading ? (
                renderSkeletonState()
            ) : isEmpty ? (
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
    skeletonContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    skeletonHeaderPlaceholder: {
        width: 120,
        height: 18,
        backgroundColor: '#1E2124',
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 20,
    },
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 28,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    skeletonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E2124',
        marginRight: 15,
    },
    skeletonInfo: {
        flex: 1,
    },
    skeletonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skeletonTitle: {
        width: '45%',
        height: 16,
        backgroundColor: '#1E2124',
        borderRadius: 4,
    },
    skeletonPrice: {
        width: '20%',
        height: 16,
        backgroundColor: '#1E2124',
        borderRadius: 4,
    },
    skeletonDesc: {
        width: '55%',
        height: 12,
        backgroundColor: '#1E2124',
        borderRadius: 4,
    },
    skeletonDate: {
        width: '25%',
        height: 12,
        backgroundColor: '#1E2124',
        borderRadius: 4,
    },
});
