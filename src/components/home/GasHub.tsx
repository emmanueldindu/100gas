import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';

const GasHub = () => {
    return (
        <View style={styles.gasHubSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Gas Hub</Text>
                <TouchableOpacity style={styles.viewStoreButton}>
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
                {['Gas Cylinders', 'Gas Burners', 'Regulators', 'Hoses', 'Accessories'].map((category, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.categoryPill, 
                            index === 0 && styles.activeCategoryPill
                        ]}
                    >
                        <Text style={[
                            styles.categoryText,
                            index === 0 && styles.activeCategoryText
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.productGrid}>
                {[1, 2, 3, 4].map((item) => (
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
                            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                                <Ionicons name="add" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
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
        // backgroundColor: '#000000',
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
});

export default GasHub;
