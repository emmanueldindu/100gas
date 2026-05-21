import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar,
    Platform,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { getProducts, getCategories, addToCart, getCart } from '../../service';
import { useQuery } from '@tanstack/react-query';

const STATIC_CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'cylinders', name: 'Gas Cylinders' },
    { id: 'burners', name: 'Gas Burners' },
    { id: 'regulators', name: 'Regulators' },
    { id: 'hoses', name: 'Hoses' },
    { id: 'accessories', name: 'Accessories' }
];

export default function GasHubScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [activeCategory, setActiveCategory] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const { data: categoriesResponse } = useQuery({
        queryKey: ['productCategories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 5,
    });

    const { data: productsResponse, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts(),
        staleTime: 1000 * 60 * 5,
    });

    const categories = categoriesResponse?.success && Array.isArray(categoriesResponse.data) && categoriesResponse.data.length > 0
        ? [{ id: 'all', name: 'All' }, ...categoriesResponse.data]
        : STATIC_CATEGORIES;

    const products = productsResponse?.success ? (productsResponse.data || []) : [];

    const syncCartCount = async () => {
        const cart = await getCart();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    };

    useFocusEffect(
        React.useCallback(() => {
            syncCartCount();
        }, [])
    );

    const handleAddToCart = async (item: any) => {
        await addToCart({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
            image: item.image || ''
        });
        syncCartCount();
    };

    const activeCat = categories[activeCategory];
    const filteredProducts = products.filter(product => {
        if (!activeCat || activeCat.id === 'all') return true;

        // If the category is fetched dynamically with actual UUIDs from db
        if (activeCat.id && !['all', 'cylinders', 'burners', 'regulators', 'hoses', 'accessories'].includes(activeCat.id)) {
            return product.categoryId === activeCat.id;
        }

        // Resilient fallback classification using name/description matching
        const catName = activeCat.name.toLowerCase();
        const prodName = (product.name || '').toLowerCase();
        const prodDesc = (product.description || '').toLowerCase();

        if (catName.includes('cylinder')) {
            return prodName.includes('cylinder') || prodDesc.includes('cylinder');
        }
        if (catName.includes('burner')) {
            return prodName.includes('burner') || prodDesc.includes('burner');
        }
        if (catName.includes('regulator')) {
            return prodName.includes('regulator') || prodDesc.includes('regulator');
        }
        if (catName.includes('hose')) {
            return prodName.includes('hose') || prodDesc.includes('hose');
        }
        
        // Accessories tab: items that don't match cylinders, burners, regulators, or hoses
        return !prodName.includes('cylinder') && 
               !prodName.includes('burner') && 
               !prodName.includes('regulator') && 
               !prodName.includes('hose');
    });

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
                    {categories.map((category, index) => (
                        <TouchableOpacity 
                            key={category.id || index.toString()} 
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
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image 
                        source={require('../../assets/images/empty.png')} 
                        style={styles.emptyImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.emptyText}>No products available in this category.</Text>
                </View>
            ) : (
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.productGrid}>
                        {filteredProducts.map((item) => (
                            <View key={item.id} style={styles.productCard}>
                                <View style={styles.productImageContainer}>
                                    <Image 
                                        source={
                                            item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))
                                                ? { uri: item.image }
                                                : require('../../assets/images/gasimg.png')
                                        } 
                                        style={styles.productImage} 
                                        resizeMode="contain" 
                                    />
                                </View>
                                <View style={styles.productInfo}>
                                    <View style={styles.productPriceContainer}>
                                        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.productPrice}>₦{item.price}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.addButton} 
                                        activeOpacity={0.8}
                                        onPress={() => handleAddToCart(item)}
                                    >
                                        <Ionicons name="add" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}

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
        paddingBottom: 120,
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
        paddingBottom: Platform.OS === 'ios' ? 40 : 60,
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 350,
        paddingHorizontal: 20,
    },
    emptyImage: {
        width: 140,
        height: 140,
        marginBottom: 16,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        textAlign: 'center',
        opacity: 0.8,
    },
});
