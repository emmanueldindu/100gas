import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { COLORS } from '../../constants/colors';

const DUMMY_ORDERS = [
    {
        id: '1',
        title: 'Delivery to Mercyland Estate',
        date: '20 Mar, 10:09 AM',
        price: '₦12,300',
    },
    {
        id: '2',
        title: 'Delivery to Mercyland Estate',
        date: '20 Mar, 10:09 AM',
        price: '₦12,300',
    },
    {
        id: '3',
        title: 'Delivery to Mercyland Estate',
        date: '20 Mar, 10:09 AM',
        price: '₦12,300',
    },
    {
        id: '4',
        title: 'Delivery to Mercyland Estate',
        date: '20 Mar, 10:09 AM',
        price: '₦12,300',
    },
];

export default function OrderHistoryScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const renderItem = ({ item }: { item: typeof DUMMY_ORDERS[0] }) => (
        <TouchableOpacity 
            style={styles.orderItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ScreenEnums.DELIVERY_DETAILS)}
        >
            <Image 
                source={require('../../assets/icons/tanker.png')} 
                style={styles.truckIcon}
                resizeMode="contain"
            />
            <View style={styles.orderMiddle}>
                <Text style={styles.orderTitle}>{item.title}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            <Text style={styles.orderPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            
            <Text style={styles.screenTitle}>Order History</Text>
            <FlatList
                data={DUMMY_ORDERS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            
            <TouchableOpacity 
                style={styles.fab} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate(ScreenEnums.REFILL_GAS)}
            >
                <Ionicons name="add" size={30} color={COLORS.primaryWhite} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
        // paddingHorizontal:
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginTop: 40,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    truckIcon: {
        width: 24,
        height: 24,
        marginRight: 14,
        tintColor: '#74757C',
    },
    orderMiddle: {
        flex: 1,
        justifyContent: 'center',
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.main_dark,
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        color: COLORS.darkGray,
    },
    orderPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
