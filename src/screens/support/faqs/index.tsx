import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportFaqsScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

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
                <Text style={styles.headerTitle}>FAQs</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>How to order a gas refill</Text>
                
                <Text style={styles.description}>
                    Running low on cooking gas? 100Gas makes it simple to refill your cylinder without leaving home. Follow these easy steps to order a gas refill and have it delivered safely to your doorstep:
                </Text>

                <View style={styles.stepContainer}>
                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>1. Download the 100gas App: </Text>
                            <Text style={styles.stepDescription}>Head to the App Store or Google Play Store and search for “100gas”. Download and install it on your smartphone to begin.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>2. Create an Account (or Log In): </Text>
                            <Text style={styles.stepDescription}>If you're a new user, sign up for a free 100gas account using your email address or phone number. Existing users can simply log in with their credentials.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>3. Set Your Delivery Location: </Text>
                            <Text style={styles.stepDescription}>Allow the app to access your current location so we can check if delivery is available in your area. If location access is unavailable, you can manually enter your street or estate address.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>4. Select Your Cylinder Size: </Text>
                            <Text style={styles.stepDescription}>Choose the gas cylinder size you want to refill. Available options typically include:</Text>
                        </Text>
                        <View style={styles.bulletPoints}>
                            <Text style={styles.bulletPoint}>• 3kg Cylinder</Text>
                            <Text style={styles.bulletPoint}>• 6kg Cylinder</Text>
                            <Text style={styles.bulletPoint}>• 12.5kg Cylinder</Text>
                            <Text style={styles.bulletPoint}>• 25kg Cylinder</Text>
                            <Text style={styles.bulletPoint}>• 50kg Cylinder</Text>
                        </View>
                        <Text style={styles.stepDescription}>Simply tap the size that matches your cylinder.</Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>5. Review Your Order Details: </Text>
                            <Text style={styles.stepDescription}>100Gas will automatically pre-fill your order with: Your selected cylinder size, your delivery address, and the recommended refill quantity. Review the information and adjust anything if needed before confirming.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>6. Choose Your Delivery Time: </Text>
                            <Text style={styles.stepDescription}>Pick a convenient delivery window from the available schedule. You can choose between “Same day”, “Next day”, and “2 Days”</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>7. Select a Payment Method: </Text>
                            <Text style={styles.stepDescription}>Choose how you’d like to pay for your refill “Card Payment”, “Bank Transfer”, and “Pay on Delivery” Follow the instructions to complete your payment or confirm your preferred option.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>8. Order Confirmation: </Text>
                            <Text style={styles.stepDescription}>Once your order is placed, you’ll see a confirmation screen showing your delivery window. 100Gas will also send you reminders before your driver arrives.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>9. Track Your Delivery in Real-Time: </Text>
                            <Text style={styles.stepDescription}>Sit back and relax! You can track your driver's progress on a live map within the app. See their estimated arrival time and watch as they get closer.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>10. Receive Your Gas Refill: </Text>
                            <Text style={styles.stepDescription}>When the driver arrives, you’ll receive a notification. Your cylinder will be safely refilled or exchanged, and your order will be completed.</Text>
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>11. Enjoy the Convenience! </Text>
                            <Text style={styles.stepDescription}>With 100Gas, refilling your cooking gas is quick, safe, and stress-free — right from your phone.</Text>
                        </Text>
                    </View>

                    <View style={styles.needHelpSection}>
                        <Text style={styles.stepText}>
                            <Text style={styles.stepLabel}>Need Help? </Text>
                            <Text style={styles.stepDescription}>No problem! 100Gas offers comprehensive support. Browse the Help Center within the app for answers to FAQs or reach out to our friendly customer service team through the built-in chat function. They're happy to assist you!</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 22,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    description: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        lineHeight: 24,
        marginBottom: 32,
    },
    stepContainer: {
        gap: 32,
    },
    step: {
        gap: 8,
    },
    stepText: {
        fontSize: 15,
        lineHeight: 24,
    },
    stepLabel: {
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    stepDescription: {
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    bulletPoints: {
        paddingLeft: 12,
        marginVertical: 4,
    },
    bulletPoint: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        lineHeight: 24,
    },
    needHelpSection: {
        marginTop: 16,
    },
});
