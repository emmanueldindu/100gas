import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Easing, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

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

    // Full arc path (used for the total arc length calculation)
    const fullArcPath = describeArc(CENTER, CENTER, RADIUS, ARC_START, ARC_END);

    // Calculate total arc length: (270/360) * 2πR
    const TOTAL_ARC_LENGTH = (TOTAL_SWEEP / 360) * 2 * Math.PI * RADIUS;

    // Animated dashoffset: starts fully hidden, animates to reveal the filled portion
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [TOTAL_ARC_LENGTH, 0],
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.scrollViewBackground}>
                <View 
                    // showsVerticalScrollIndicator={false}
                    // contentContainerStyle={styles.scrollContent}
                >
                {/* Header Container */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.userInfo}>
                            <View style={styles.imageBorder}>
                                <Image 
                                    source={require('../../assets/images/user.png')} 
                                    style={styles.profileImage}
                                />
                            </View>
                            <View style={styles.greetingContainer}>
                                <Text style={styles.greetingText}>Good Morning 🌞</Text>
                                <Text style={styles.userName}>Miracle Emeka</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.main_dark} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main scrollable content below header */}
                <View style={styles.mainContent}>

                {/* Gas Level Section */}
                <View style={styles.gasLevelWrapper}>
                    <View style={styles.ringContainer}>
                        <View style={styles.ringShadow}>
                            <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
                                <Defs>
                                    {/* Gradient: lighter green at start → deeper green at end */}
                                    <LinearGradient id="gasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <Stop offset="0%" stopColor="#A8F59C" stopOpacity="1" />
                                        <Stop offset="35%" stopColor="#6AE85E" stopOpacity="1" />
                                        <Stop offset="70%" stopColor="#45D63B" stopOpacity="1" />
                                        <Stop offset="100%" stopColor="#2DBE22" stopOpacity="1" />
                                    </LinearGradient>
                                </Defs>

                                {/* Background track (very faint) */}
                                <Path
                                    d={fullArcPath}
                                    stroke="#E8E8E8"
                                    strokeWidth={STROKE_WIDTH}
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity={0.3}
                                />

                                {/* Animated progress arc */}
                                <AnimatedPath
                                    d={fullArcPath}
                                    stroke="url(#gasGrad)"
                                    strokeWidth={STROKE_WIDTH}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={TOTAL_ARC_LENGTH}
                                    strokeDashoffset={strokeDashoffset}
                                />
                            </Svg>
                        </View>
                        
                        {/* Gas Cylinder Image */}
                        <Image 
                            source={require('../../assets/images/gasimg.png')}
                            style={styles.largeGasImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.gasStatusContainer}>
                        <View style={styles.gasLevelTitleRow}>
                            <Image source={require('../../assets/icons/fire.png')} style={styles.fireIcon} />
                            <Text style={styles.gasLevelTitle}>Gas Level</Text>
                        </View>
                        <Text style={styles.gasStatusText}>You're good!</Text>
                        <Text style={styles.gasStatusSubtext}>Estimated 18 days of gas left</Text>
                    </View>
                </View>
                </View>

                {/* Other components will follow */}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewBackground: {
        flex: 1,
        backgroundColor: '#FFF4F6',
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#FFF4F6',
    },
    header: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 10,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    mainContent: {
        paddingHorizontal: 20,
        marginTop: 40, // Increased margin to push everything down
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageBorder: {
        width: 66,
        height: 66,
        borderRadius: 33,
        borderWidth: 1.5,
        borderColor: '#DD5844',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    greetingContainer: {
        marginLeft: 12,
    },
    greetingText: {
        fontSize: 14,
        color: '#74757C',
        marginBottom: 2,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primaryWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
    },
    gasLevelWrapper: {
        alignItems: 'center',
        marginTop: 30, // Pushed further down
    },
    ringContainer: {
        width: SVG_SIZE,
        height: SVG_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    ringShadow: {
        position: 'absolute',
        top: 0,
        shadowColor: '#54DD4D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
    },
    largeGasImage: {
        width: 160,
        height: 240,
        position: 'absolute',
        bottom: 40,
    },
    gasStatusContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    gasLevelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    fireIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
        resizeMode: 'contain',
    },
    gasLevelTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.main_dark,
    },
    gasStatusText: {
        fontSize: 15,
        color: COLORS.main_dark,
        fontWeight: '500',
        marginBottom: 2,
    },
    gasStatusSubtext: {
        fontSize: 14,
        color: '#74757C',
    },
});
