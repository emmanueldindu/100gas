import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackNavigationProp } from '../screens.types';

export default function OffersAndPromosScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Offers and promos</Text>

                <View style={styles.offersList}>
                    <Image 
                        source={require('../../assets/images/Frame 1171276522.png')} 
                        style={styles.offerImage}
                        resizeMode="contain"
                    />
                    <Image 
                        source={require('../../assets/images/Frame 1171276522.png')} 
                        style={styles.offerImage}
                        resizeMode="contain"
                    />
                    <Image 
                        source={require('../../assets/images/Frame 1171276522.png')} 
                        style={styles.offerImage}
                        resizeMode="contain"
                    />
                    <Image 
                        source={require('../../assets/images/Frame 1171276522.png')} 
                        style={styles.offerImage}
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 32,
    },
    offersList: {
        gap: 20,
    },
    offerImage: {
        width: '100%',
        height: 140, // Height adjusted to look good and match mockup proportions
        borderRadius: 16,
    },
});
