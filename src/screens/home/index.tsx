import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Easing, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import PromoCarousel from '../../components/home/PromoCarousel';
import GasHub from '../../components/home/GasHub';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Helper: generate an SVG arc path from startAngle to endAngle (in degrees)
// The arc goes clockwise. 0° = top of the circle.
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
    };
}

// Config
const SVG_SIZE = 360;
const CENTER = SVG_SIZE / 2;
const RADIUS = 150;
const STROKE_WIDTH = 26;

// The arc spans from 135° to 405° (i.e. 270° total sweep, open at bottom)
const ARC_START = 135;
const ARC_END = 405;
const TOTAL_SWEEP = ARC_END - ARC_START; // 270°

// Gas level: 0.0 to 1.0 (0.65 = 65% full)
const GAS_LEVEL = 0.65;

export default function HomeScreen() {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: GAS_LEVEL,
            duration: 1800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, []);

    const fullArcPath = describeArc(CENTER, CENTER, RADIUS, ARC_START, ARC_END);
    const TOTAL_ARC_LENGTH = (TOTAL_SWEEP / 360) * 2 * Math.PI * RADIUS;

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [TOTAL_ARC_LENGTH, 0],
    });

    return (
        <SafeAreaView style={styles.container} edges = {['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>ME</Text>
                        </View>
                        <View style={styles.greetingContainer}>
                            <Text style={styles.greetingText}>
                                <Text style={styles.helloText}>Hello, </Text>
                                Miracle
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                        <Image resizeMode='contain' source={require('../../assets/icons/notification.png')} style={styles.notificationIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.mainContent}
                contentContainerStyle={styles.scrollContent}
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
                            {/* Background Track */}
                            <Circle
                                cx="90"
                                cy="90"
                                r={70}
                                stroke="#2F3338"
                                strokeWidth="16"
                                fill="none"
                            />
                            {/* Progress Arc */}
                            <AnimatedCircle
                                cx="90"
                                cy="90"
                                r={70}
                                stroke="#FFFFFF"
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
                    </View>

                    <View style={styles.statusInfo}>
                        <Text style={styles.statusTitle}>You're good!</Text>
                        <Text style={styles.statusSubtitle}>Estimated 18 days of gas left</Text>
                    </View>

                    <TouchableOpacity style={styles.refillButton} activeOpacity={0.8}>
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
        fontFamily: FONT.garnet_400_regular,
        color: '#D0D5DD',
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
});
