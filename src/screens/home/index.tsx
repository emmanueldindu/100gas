import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Easing, StatusBar, ActivityIndicator, DeviceEventEmitter, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import PromoCarousel from '../../components/home/PromoCarousel';
import GasHub from '../../components/home/GasHub';

import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { getUserCylinders, getProfile, getCart } from '../../service';
import { useQuery } from '@tanstack/react-query';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const animatedValue = useRef(new Animated.Value(0)).current;

    const { data: cylindersResponse, isLoading, refetch: refetchCylinders } = useQuery({
        queryKey: ['cylinders'],
        queryFn: getUserCylinders,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const { data: profileResponse, refetch: refetchProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });

    const [refreshing, setRefreshing] = useState(false);
    const isAnyLoading = isLoading || refreshing;

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                refetchCylinders(),
                refetchProfile(),
                updateCartCount()
            ]);
        } catch (error) {
            console.error('[Home] Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const [localUser, setLocalUser] = useState<any>(null);
    const [isCacheLoaded, setIsCacheLoaded] = useState(false);

    useEffect(() => {
        const loadCachedUser = async () => {
            try {
                const cached = await AsyncStorage.getItem('cachedProfile');
                if (cached) {
                    setLocalUser(JSON.parse(cached));
                }
            } catch (e) {
                // ignore
            } finally {
                setIsCacheLoaded(true);
            }
        };
        loadCachedUser();
    }, []);

    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        const cart = await getCart();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    };

    useEffect(() => {
        updateCartCount();

        const subscription = DeviceEventEmitter.addListener('cart_updated', () => {
            updateCartCount();
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const user = profileResponse?.data || localUser;

    const getInitials = () => {
        if (!user) return isCacheLoaded ? 'ME' : '';
        const f = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
        const l = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
        return (f + l) || (isCacheLoaded ? 'ME' : '');
    };

    const displayName = user?.firstName || (isCacheLoaded ? 'User' : '...');

    const cylinder = cylindersResponse?.success && Array.isArray(cylindersResponse.data) && cylindersResponse.data.length > 0
        ? (cylindersResponse.data.find(cyl => cyl.isActive) || cylindersResponse.data[0])
        : null;

    useEffect(() => {
        if (cylinder) {
            Animated.timing(animatedValue, {
                toValue: cylinder.currentPercentage / 100,
                duration: 1800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        } else if (!isAnyLoading) {
            Animated.timing(animatedValue, {
                toValue: 0.65,
                duration: 1800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }
    }, [cylinder, isAnyLoading]);

    const getStatusDetails = () => {
        if (isAnyLoading) {
            return {
                title: "",
                subtitle: "",
                color: "#2F3338",
            };
        }

        if (!cylinder) {
            return {
                title: "No Smart Cylinder",
                subtitle: "Set up a cylinder to track gas level",
                color: "#2F3338",
            };
        }

        const pct = cylinder.currentPercentage;
        
        let estimatedDaysStr = "";
        if (cylinder.predictedEmptyDate) {
            const diffTime = new Date(cylinder.predictedEmptyDate).getTime() - Date.now();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            estimatedDaysStr = `Estimated ${diffDays} days of gas left`;
        }

        if (pct === 0) {
            return {
                title: "Out of Gas",
                subtitle: "You've run out of gas",
                color: "#2F3338",
            };
        } else if (pct > 0 && pct <= 15) {
            return {
                title: "Low Gas",
                subtitle: estimatedDaysStr || "Estimated 2 days of gas left",
                color: "#EF4444",
            };
        } else if (pct > 15 && pct <= 40) {
            return {
                title: "Running Low",
                subtitle: estimatedDaysStr || "Estimated 7 days of gas left",
                color: "#EAB308",
            };
        } else if (pct > 40 && pct <= 85) {
            return {
                title: "You're good!",
                subtitle: estimatedDaysStr || "Estimated 18 days of gas left",
                color: "#FFFFFF",
            };
        } else {
            return {
                title: "Fully Refilled",
                subtitle: estimatedDaysStr || "Estimated 20 days of gas left",
                color: "#FFFFFF",
            };
        }
    };

    const statusDetails = getStatusDetails();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>
                        <View style={styles.greetingContainer}>
                            <Text style={styles.greetingText}>
                                <Text style={styles.helloText}>Hello, </Text>
                                {displayName}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.notificationButton} 
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate(ScreenEnums.NOTIFICATIONS)}
                    >
                        <Image resizeMode='contain' source={require('../../assets/icons/notification.png')} style={styles.notificationIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.mainContent}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor="#FFFFFF" 
                        colors={["#FFFFFF"]}
                        progressBackgroundColor="#1E2124"
                    />
                }
            >
                {/* Gas Level Card */}
                <View style={styles.card}>
                    <View style={styles.ringContainer}>
                        <Svg width={180} height={180} viewBox="0 0 180 180">
                            <Defs>
                                <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <Stop offset="0%" stopColor="#FFFFFF" />
                                    <Stop offset="100%" stopColor="#FFFFFF" />
                                </LinearGradient>
                            </Defs>
                            <Circle
                                cx="90"
                                cy="90"
                                r={70}
                                stroke="#2F3338"
                                strokeWidth="16"
                                fill="none"
                            />
                            <AnimatedCircle
                                cx="90"
                                cy="90"
                                r={70}
                                stroke={statusDetails.color}
                                strokeWidth="16"
                                fill="none"
                                strokeDasharray={Math.PI * 2 * 70}
                                strokeDashoffset={animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [Math.PI * 2 * 70, 0],
                                })}
                                strokeLinecap="round"
                                transform="rotate(-90, 90, 90)"
                            />
                        </Svg>
                        <Image 
                            source={require('../../assets/images/gasimg.png')}
                            style={styles.gasCylinderImage}
                            resizeMode="contain"
                        />
                        {isAnyLoading && (
                            <View style={styles.loaderOverlay}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                            </View>
                        )}
                    </View>

                    <View style={styles.statusInfo}>
                        {isAnyLoading ? (
                            <View style={styles.skeletonContainer}>
                                <View style={styles.skeletonTitle} />
                                <View style={styles.skeletonSubtitle} />
                            </View>
                        ) : (
                            <>
                                <Text style={styles.statusTitle}>{statusDetails.title}</Text>
                                <Text style={styles.statusSubtitle}>{statusDetails.subtitle}</Text>
                            </>
                        )}
                    </View>

                    <TouchableOpacity 
                        style={styles.refillButton} 
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate(ScreenEnums.REFILL_GAS)}
                    >
                        <Text style={styles.refillButtonText}>Refill Gas</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions Section */}
                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsContainer}>
                        <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7}>
                            <View style={styles.actionIconCircle}>
                                <Image 
                                    source={require('../../assets/icons/call.png')} 
                                    style={styles.actionIcon} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <Text style={styles.actionText}>Order by{"\n"}Phone Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7}>
                            <View style={styles.actionIconCircle}>
                                <Image 
                                    source={require('../../assets/icons/message.png')} 
                                    style={styles.actionIcon} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <Text style={styles.actionText}>Chat with Us</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.7}>
                            <View style={styles.actionIconCircle}>
                                <Image 
                                    source={require('../../assets/icons/rotate.png')} 
                                    style={styles.actionIcon} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <Text style={styles.actionText}>Reorder</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Promo Carousel */}
                <PromoCarousel />

                {/* Gas Hub Section */}
                <GasHub />

                {/* Bottom Gap to allow scrolling above the Bottom Tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {cartCount > 0 && (
                <TouchableOpacity 
                    style={styles.floatingCartButton}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate(ScreenEnums.CART)}
                >
                    <Ionicons name="cart" size={28} color="#FFFFFF" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    header: {
        backgroundColor: '#1E1E1E',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#B190B6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    greetingContainer: {
        marginLeft: 12,
    },
    greetingText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    helloText: {
        fontFamily: FONT.garnet_300_light,
        color: '#D0D5DD',
    },
    notificationButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 24,
        height: 24,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        paddingBottom: 20, // Bottom gap View handles the rest
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    card: {
        backgroundColor: '#000000',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
    },
    ringContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 24,
    },
    gasCylinderImage: {
        width: 80,
        height: 120,
        position: 'absolute',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 90,
    },
    statusInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    statusTitle: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#74757C',
        fontFamily: FONT.garnet_400_regular,
    },
    skeletonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    skeletonTitle: {
        width: 140,
        height: 24,
        backgroundColor: '#2F3338',
        borderRadius: 12,
        marginBottom: 8,
    },
    skeletonSubtitle: {
        width: 180,
        height: 16,
        backgroundColor: '#2F3338',
        borderRadius: 8,
    },
    refillButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 48,
        borderRadius: 30,
        alignItems: 'center',
    },
    refillButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    quickActionsSection: {
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: '#000000',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2F3338',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionIcon: {
        width: 24,
        height: 24,
    },
    actionText: {
        fontSize: 12,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 16,
    },
    floatingCartButton: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        zIndex: 9999,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#000000',
    },
    cartBadgeText: {
        color: '#000000',
        fontSize: 10,
        fontFamily: FONT.garnet_600_semibold,
        textAlign: 'center',
    },
});
