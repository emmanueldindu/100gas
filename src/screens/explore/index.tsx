import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Explore Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLORS.white,
        fontSize: 18,
    },
});
