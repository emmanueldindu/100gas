import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function Onboarding1Screen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Onboarding 1 Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLORS.black,
        fontSize: 18,
    },
});
