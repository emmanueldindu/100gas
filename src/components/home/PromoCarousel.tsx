import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { FONT } from '../../constants/fonts';

const { width: width_screen } = Dimensions.get('window');

const PromoCarousel = () => {
    const scrollX = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.promosSection}>
            <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Offers and Promos</Text>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {[1, 2, 3].map((_, index) => (
                    <View key={index} style={styles.promoSlide}>
                        <Image 
                            source={require('../../assets/images/promo.png')} 
                            style={styles.promoImage} 
                            resizeMode="stretch" 
                        />
                    </View>
                ))}
            </ScrollView>
            
            <View style={styles.indicatorContainer}>
                {[0, 1, 2].map((index) => {
                    const width = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * width_screen,
                            index * width_screen,
                            (index + 1) * width_screen,
                        ],
                        outputRange: [8, 24, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * width_screen,
                            index * width_screen,
                            (index + 1) * width_screen,
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View 
                            key={index} 
                            style={[styles.indicator, { width, opacity }]} 
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    promosSection: {
        marginTop: 40,
        marginHorizontal: -20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    promoSlide: {
        width: width_screen,
        height: 140,
        paddingHorizontal: 20,
    },
    promoImage: {
        width: '100%',
        height: '100%',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    indicator: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#74757C',
        marginHorizontal: 4,
    },
});

export default PromoCarousel;
