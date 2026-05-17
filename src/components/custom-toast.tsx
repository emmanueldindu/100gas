import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { COLORS } from '../constants/colors';
import { FONT } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const toastConfig: ToastConfig = {
    success: (props) => (
        <View style={styles.toastContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: COLORS.success }]} />
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
            </View>
        </View>
    ),
    error: (props) => (
        <View style={styles.toastContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: COLORS.error }]} />
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
            </View>
        </View>
    ),
    info: (props) => (
        <View style={styles.toastContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: COLORS.primary }]} />
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
            </View>
        </View>
    ),
};

const styles = StyleSheet.create({
    toastContainer: {
        height: 'auto',
        minHeight: 60,
        width: width * 0.9,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statusIndicator: {
        position: 'absolute',
        left: 0,
        top: 12,
        bottom: 12,
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    iconContainer: {
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text1: {
        fontSize: 15,
        fontFamily: FONT.garnet_600_semibold,
        color: COLORS.primaryWhite,
        marginBottom: 2,
    },
    text2: {
        fontSize: 13,
        fontFamily: FONT.garnet_400_regular,
        color: COLORS.secondaryGray,
    },
});
