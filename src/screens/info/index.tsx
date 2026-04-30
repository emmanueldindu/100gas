import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    Easing 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../screens/screens.types';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';

export default function InfoScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const insets = useSafeAreaInsets();
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Animation shared values
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    const startAnimation = useCallback(() => {
        opacity.value = withTiming(1, {
            duration: 800,
            easing: Easing.out(Easing.quad),
        });
        translateY.value = withTiming(0, {
            duration: 800,
            easing: Easing.out(Easing.quad),
        });
    }, [opacity, translateY]);

    useEffect(() => {
        if (imageLoaded) {
            startAnimation();
        }
    }, [imageLoaded, startAnimation]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.contentContainer}>
                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                    <Image 
                        source={require('../../assets/images/info.png')} 
                        style={styles.logo}
                        contentFit="contain"
                        onLoad={() => setImageLoaded(true)}
                        cachePolicy="memory-disk"
                    />
                </Animated.View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Gas when you need it.</Text>
                    <Text style={styles.title}>Before you need it.</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.createButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AuthStack', { screen: 'PHONE_NUMBER' })}
                >
                    <Text style={styles.createButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.signInButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('AuthStack', { screen: 'PHONE_NUMBER' })}
                >
                    <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: 400, 
    },
    textContainer: {
        marginTop: '5%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        color: COLORS.primaryWhite,
        lineHeight: 34,
        fontFamily: FONT.garnet_500_medium,
    },
    buttonContainer: {
        gap: 12,
        width: '100%',
    },
    createButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
    },
    signInButton: {
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#74757C',
    },
    signInButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
    },
});
