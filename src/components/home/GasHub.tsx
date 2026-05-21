import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import ScreenEnums from '../../enums/screen-enums';
import { RootStackNavigationProp } from '../../screens/screens.types';
import { getProducts, getCategories, addToCart } from '../../service';
import { useQuery } from '@tanstack/react-query';

const STATIC_CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'cylinders', name: 'Gas Cylinders' },
    { id: 'burners', name: 'Gas Burners' },
    { id: 'regulators', name: 'Regulators' },
    { id: 'hoses', name: 'Hoses' },
    { id: 'accessories', name: 'Accessories' }
];

const GasHub = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

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

    // Filter products dynamically in memory
    const activeCat = categories[activeCategoryIndex];
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
        <View style={styles.gasHubSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Gas Hub</Text>
                <TouchableOpacity 
                    style={styles.viewStoreButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(ScreenEnums.GAS_HUB)}
                >
                    <Text style={styles.viewStoreText}>View Store</Text>
                    <Ionicons name="chevron-forward" size={16} color="#D0D5DD" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity 
                        key={category.id || index.toString()} 
                        style={[
                            styles.categoryPill, 
                            activeCategoryIndex === index && styles.activeCategoryPill
                        ]}
                        onPress={() => setActiveCategoryIndex(index)}
                    >
                        <Text style={[
                            styles.categoryText,
                            activeCategoryIndex === index && styles.activeCategoryText
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
                                    onPress={() => addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
                                        image: item.image || ''
                                    })}
                                >
                                    <Ionicons name="add" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    gasHubSection: {
        marginTop: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    viewStoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewStoreText: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#D0D5DD',
        marginRight: 4,
    },
    categoriesContainer: {
        marginBottom: 24,
    },
    categoriesContent: {
        paddingRight: 20,
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
    loaderContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyImage: {
        width: 120,
        height: 120,
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

export default GasHub;
