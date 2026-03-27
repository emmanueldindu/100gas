import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RootStackNavigationProp } from '../screens.types';
import ScreenEnums from '../../enums/screen-enums';

interface InfoItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onEdit?: () => void;
}

const InfoItem = ({ icon, value, onEdit }: InfoItemProps) => (
    <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
            <Ionicons name={icon} size={22} color={COLORS.darkGray} />
            <Text style={styles.infoText}>{value}</Text>
        </View>
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
            <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
    </View>
);

export default function PersonalInfoScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <SafeAreaViewContext style={styles.container} edges={['top']}>
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
                <Text style={styles.title}>Personal Info</Text>

                <View style={styles.infoList}>
                    <InfoItem 
                        icon="person-outline" 
                        value="Miracle Emeka" 
                        onEdit={() => navigation.navigate(ScreenEnums.UPDATE_NAME)}
                    />
                    <View style={styles.separator} />
                    
                    <InfoItem 
                        icon="phone-portrait-outline" 
                        value="+2349026190455" 
                    />
                    <View style={styles.separator} />

                    <InfoItem 
                        icon="mail-outline" 
                        value="miraclemek@gmail.com" 
                        onEdit={() => navigation.navigate(ScreenEnums.UPDATE_EMAIL)}
                    />
                    <View style={styles.separator} />
                </View>
            </ScrollView>
        </SafeAreaViewContext>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 40,
    },
    infoList: {
        gap: 2,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoText: {
        fontSize: 16,
        color: COLORS.main_dark,
        fontWeight: '400',
    },
    editText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.main_dark,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        width: '100%',
    },
});
