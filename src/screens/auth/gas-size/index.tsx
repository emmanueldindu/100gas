import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';
import NavigationHeader from '@/src/components/navigation-header';

const GAS_SIZES = [
    { label: '3kg cylinder', value: 'KG_3' },
    { label: '6kg cylinder', value: 'KG_6' },
    { label: '12.5kg cylinder', value: 'KG_12_5' },
    { label: '25kg cylinder', value: 'KG_25' },
    { label: '50kg cylinder', value: 'KG_50' },
];

const CYLINDER_COUNTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function GasSizeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'GAS_SIZE'>>();
    
    const [selectedSize, setSelectedSize] = useState<{label: string, value: string} | null>(null);
    const [selectedCount, setSelectedCount] = useState<string | null>(null);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [showCountDropdown, setShowCountDropdown] = useState(false);

    const isReady = selectedSize && selectedCount;

    const handleContinue = () => {
        // In a real app, you'd save this data to the server here.
        // For now, we'll just navigate to the main app as requested.
        navigation.navigate(ScreenEnums.BOTTOM_TABS as any);
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryBlack }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <NavigationHeader
                        title="Gas Cylinder Setup" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.content}>
                        <Text style={styles.description}>
                            Set the size of your cylinder and the number of cylinders you want to refill
                        </Text>
                        
                        <View style={styles.form}>
                            {/* Size Selector */}
                            <View style={[styles.inputGroup, { zIndex: showSizeDropdown ? 2000 : 1 }]}>
                                <Text style={styles.label}>Choose the size of cylinder you want to refill</Text>
                                <TouchableOpacity 
                                    style={styles.selector}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setShowSizeDropdown(!showSizeDropdown);
                                        setShowCountDropdown(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedSize && { color: '#74757C' }
                                    ]}>
                                        {selectedSize?.label || 'Select Cylinder Size'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                                </TouchableOpacity>

                                {showSizeDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled={true}>
                                            {GAS_SIZES.map((item) => (
                                                <TouchableOpacity 
                                                    key={item.value}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedSize(item);
                                                        setShowSizeDropdown(false);
                                                    }}
                                                >
                                                    <Text style={styles.itemText}>{item.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Count Selector */}
                            <View style={[styles.inputGroup, { zIndex: showCountDropdown ? 2000 : 0 }]}>
                                <Text style={styles.label}>Select the number of cylinders to refill</Text>
                                <TouchableOpacity 
                                    style={styles.selector}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setShowCountDropdown(!showCountDropdown);
                                        setShowSizeDropdown(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedCount && { color: '#74757C' }
                                    ]}>
                                        {selectedCount ? `${selectedCount} Cylinder${selectedCount !== '1' ? 's' : ''}` : 'Select Number of Cylinders'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                                </TouchableOpacity>

                                {showCountDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                                            {CYLINDER_COUNTS.map((item) => (
                                                <TouchableOpacity 
                                                    key={item}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedCount(item);
                                                        setShowCountDropdown(false);
                                                    }}
                                                >
                                                    <Text style={styles.itemText}>{item} Cylinder{item !== '1' ? 's' : ''}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={[styles.continueButton, !isReady && styles.disabledButton]}
                            activeOpacity={0.8}
                            disabled={!isReady}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    content: {
        marginTop: 24,
    },
    description: {
        fontSize: 14,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
        lineHeight: 20,
        marginBottom: 32,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
        zIndex: 1,
    },
    label: {
        fontSize: 14,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
        marginBottom: 8,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: '#C2C2C2',
        borderRadius: 4,
        paddingHorizontal: 16,
    },
    selectorText: {
        fontSize: 16,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
    },
    dropdownMenu: {
        marginTop: 4,
        backgroundColor: '#1E1E1E',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2F3338',
        maxHeight: 200,
        zIndex: 1000,
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2F3338',
    },
    itemText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 40,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT.garnet_500_medium,
    },
});
