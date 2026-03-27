import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportFaqsScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color={COLORS.main_dark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>How to order a gas refill</Text>
                
                <Text style={styles.description}>
                    Running low on cooking gas? 100Gas makes it simple to refill your cylinder without leaving home. Follow these easy steps to order a gas refill and have it delivered safely to your doorstep:
                </Text>

                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>
                        <Text style={styles.stepNumber}>1. Download the 100gas App: </Text>
                        Head to the App Store or Google Play Store and search for "100gas". Download and install it on your smartphone to begin.
                    </Text>

                    <Text style={styles.stepText}>
                        <Text style={styles.stepNumber}>2. Create an Account (or Log In): </Text>
                        If you're a new user, sign up for a free 100gas account using your email address or phone number. Existing users can simply log in with their credentials.
                    </Text>

                    <Text style={styles.stepText}>
                        <Text style={styles.stepNumber}>3. Set Your Delivery Location: </Text>
                        Allow the app to access your current location so we can check if delivery is available in your area. If location access is unavailable, you can manually enter your street or estate address.
                    </Text>

                    <Text style={styles.stepText}>
                        <Text style={styles.stepNumber}>4. Select Your Cylinder Size: </Text>
                        Choose the gas cylinder size you want to refill. Available options typically include:
                    </Text>
                    
                    <View style={styles.bulletPointsContainer}>
                        <Text style={styles.bulletPoint}>• 3kg Cylinder</Text>
                        <Text style={styles.bulletPoint}>• 6kg Cylinder</Text>
                        <Text style={styles.bulletPoint}>• 12.5kg Cylinder</Text>
                        <Text style={styles.bulletPoint}>• 25kg Cylinder</Text>
                        <Text style={styles.bulletPoint}>• 50kg Cylinder</Text>
                        <Text style={[styles.stepText, { marginTop: 4 }]}>Simply tap the size that matches your cylinder.</Text>
                    </View>

                    <Text style={styles.stepText}>
                        <Text style={styles.stepNumber}>5. Review Your Order Details: </Text>
                        100Gas will automatically pre-fill your order with your selected cylinder size.
                    </Text>
                </View>
                
            </ScrollView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    closeButton: {
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
        paddingTop: 10,
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 24,
        marginBottom: 24,
    },
    stepContainer: {
        gap: 20,
    },
    stepText: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 24,
    },
    stepNumber: {
        color: COLORS.darkGray,
    },
    bulletPointsContainer: {
        paddingLeft: 20,
        marginTop: -10, // Pull it closer to the text above
        marginBottom: 4,
    },
    bulletPoint: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 24,
    },
});
