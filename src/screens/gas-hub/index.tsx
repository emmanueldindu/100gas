import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

const CATEGORIES = ['Gas Cylinders', 'Gas Burners', 'Regulators', 'Hoses', 'Accessories'];

export default function GasHubScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [activeCategory, setActiveCategory] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gas Hub</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.categoriesWrapper}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.categoriesContent}
                >
                    {CATEGORIES.map((category, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.categoryPill, 
                                activeCategory === index && styles.activeCategoryPill
                            ]}
                            onPress={() => setActiveCategory(index)}
                        >
                            <Text style={[
                                styles.categoryText,
                                activeCategory === index && styles.activeCategoryText
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.productGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <View key={item} style={styles.productCard}>
                            <View style={styles.productImageContainer}>
                                <Image 
                                    source={require('../../assets/images/gasimg.png')} 
                                    style={styles.productImage} 
                                    resizeMode="contain" 
                                />
                            </View>
                            <View style={styles.productInfo}>
                                <View style={styles.productPriceContainer}>
                                    <Text style={styles.productName}>Gas Cylinder</Text>
                                    <Text style={styles.productPrice}>N18000</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.addButton} 
                                    activeOpacity={0.8}
                                    onPress={handleAddToCart}
                                >
                                    <Ionicons name="add" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.cartButton}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(ScreenEnums.CART)}
                >
                    <Text style={styles.cartButtonText}>Go to Cart</Text>
                    {cartCount > 0 ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>
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
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#2F3338',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    categoriesWrapper: {
        marginBottom: 24,
    },
    categoriesContent: {
        paddingHorizontal: 20,
    },
    categoryPill: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 27,
        borderWidth: 1,
        borderColor: '#2F3338',
        marginRight: 10,
    },
    activeCategoryPill: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    categoryText: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#D0D5DD',
    },
    activeCategoryText: {
        color: '#2F3338',
        fontFamily: FONT.garnet_400_regular,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 100,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        marginBottom: 20,
    },
    productImageContainer: {
        borderRadius: 12,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
        marginBottom: 12,
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    productPriceContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        paddingTop: 16,
        backgroundColor: COLORS.primaryBlack,
    },
    cartButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
    badge: {
        backgroundColor: '#FFFFFF',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 4,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 12,
        fontFamily: FONT.garnet_700_bold,
    },
});
