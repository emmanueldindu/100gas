import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';

export default function PaymentSuccessScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    const handleBackHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenEnums.BOTTOM_TABS as any }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.illustrationContainer}>
                    <Image 
                        source={require('../../assets/images/sucess.png')} 
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Payment{"\n"}Successful</Text>
                    <Text style={styles.subtitle}>
                        Your refill order is being processed.{"\n"}
                        Expect a follow up call from a 100gas Staff
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.homeButton}
                    activeOpacity={0.8}
                    onPress={handleBackHome}
                >
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 40,
        fontFamily: FONT.garnet_700_bold,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 48,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
    },
    homeButton: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
