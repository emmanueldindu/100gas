import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';
import NavigationHeader from '@/src/components/navigation-header';
import { registerUser } from '../../../service/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const GAS_SIZES = [
    { label: '3kg cylinder', value: 'KG_3' },
    { label: '6kg cylinder', value: 'KG_6' },
    { label: '12.5kg cylinder', value: 'KG_12_5' },
    { label: '25kg cylinder', value: 'KG_25' },
    { label: '50kg cylinder', value: 'KG_50' },
];

export default function GasSizeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'GAS_SIZE'>>();
    
    const [selectedSize, setSelectedSize] = useState<{label: string, value: string} | null>(null);
    const [selectedCount, setSelectedCount] = useState<string | null>(null);
    const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
    const [isCountModalVisible, setIsCountModalVisible] = useState(false);
    const [tempCount, setTempCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const isReady = selectedSize && selectedCount;

    const toggleSizeModal = () => setIsSizeModalVisible(!isSizeModalVisible);
    
    const toggleCountModal = () => {
        setTempCount(selectedCount ? parseInt(selectedCount, 10) : 1);
        setIsCountModalVisible(!isCountModalVisible);
    };

    const handleCountConfirm = () => {
        setSelectedCount(tempCount.toString());
        setIsCountModalVisible(false);
    };

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            const quantity = parseInt(selectedCount || '1', 10);
            const cylinderSize = selectedSize?.value || 'KG_3';
            const cylinderData = Array(quantity).fill(null).map(() => ({ size: cylinderSize }));

            const payload = {
                ...route.params?.payload,
                lastName: route.params?.payload?.lastName || route.params?.payload?.firstName || 'User',
                customerType: route.params?.payload?.customerType || 'HOUSEHOLD',
                cylinderData,
                qrScanSessionId: route.params?.payload?.qrScanSessionId || "00000000-0000-0000-0000-000000000000"
            };

            console.log('[Register] Final Registration Payload:', JSON.stringify(payload, null, 2));

            const data = await registerUser(payload);
            console.log('[Register] Registration Response:', JSON.stringify(data, null, 2));

            if (data?.success) {
                // Store tokens and user info
                await AsyncStorage.multiSet([
                    ['accessToken', data?.data?.tokens?.accessToken || ''],
                    ['refreshToken', data?.data?.tokens?.refreshToken || ''],
                    ['userToken', JSON.stringify(data?.data?.user || {})]
                ]);

                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'Welcome to 100 Gas!'
                });

                // Navigate to main app
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenEnums.BOTTOM_TABS as any }],
                });
            } else {
                throw new Error(data?.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('[Register] Registration Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error?.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
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
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Choose the size of cylinder you want to refill</Text>
                                <TouchableOpacity 
                                    style={styles.selector}
                                    activeOpacity={0.7}
                                    onPress={toggleSizeModal}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedSize && { color: '#74757C' }
                                    ]}>
                                        {selectedSize?.label || 'Select Cylinder Size'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Count Selector */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select the number of cylinders to refill</Text>
                                <TouchableOpacity 
                                    style={styles.selector}
                                    activeOpacity={0.7}
                                    onPress={toggleCountModal}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedCount && { color: '#74757C' }
                                    ]}>
                                        {selectedCount ? `${selectedCount} Cylinder${selectedCount !== '1' ? 's' : ''}` : 'Select Number of Cylinders'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={[styles.continueButton, (!isReady || isLoading) && styles.disabledButton]}
                            activeOpacity={0.8}
                            disabled={!isReady || isLoading}
                            onPress={handleContinue}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.continueText}>Complete Registration</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Size Selection Modal */}
            <Modal
                visible={isSizeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleSizeModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={toggleSizeModal} 
                    >
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHeader}>
                            <Text style={styles.bottomSheetTitle}>Select Cylinder Size</Text>
                            <TouchableOpacity onPress={toggleSizeModal} style={styles.closeButton}>
                                <Image source={require("../../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={GAS_SIZES}
                            keyExtractor={(item) => item.value}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.optionItem}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setSelectedSize(item);
                                        toggleSizeModal();
                                    }}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                    <View style={[
                                        styles.radioButton,
                                        selectedSize?.value === item.value && styles.radioButtonActive
                                    ]}>
                                        {selectedSize?.value === item.value && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.divider} />}
                        />
                    </View>
                </View>
            </Modal>

            {/* Count Stepper Modal */}
            <Modal
                visible={isCountModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleCountModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={toggleCountModal} 
                    >
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHeader}>
                            <View>
                                <Text style={styles.bottomSheetTitle}>Select Number of Cylinders</Text>
                                <Text style={styles.bottomSheetSubtitle}>Bulk Orders may attract discounts</Text>
                            </View>
                            <TouchableOpacity onPress={toggleCountModal} style={styles.closeButton}>
                                <Image source={require("../../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.stepperContainer}>
                            <View style={styles.stepper}>
                                <TouchableOpacity 
                                    style={styles.stepperButton}
                                    onPress={() => setTempCount(Math.max(1, tempCount - 1))}
                                >
                                    <Ionicons name="remove" size={18} color="#000000" />
                                </TouchableOpacity>
                                
                                <Text style={styles.stepperValue}>{tempCount}</Text>
                                
                                <TouchableOpacity 
                                    style={styles.stepperButton}
                                    onPress={() => setTempCount(tempCount + 1)}
                                >
                                    <Ionicons name="add" size={18} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.modalContinueButton}
                            activeOpacity={0.8}
                            onPress={handleCountConfirm}
                        >
                            <Text style={styles.modalContinueText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomSheet: {
        backgroundColor: '#2F3338',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 50,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    bottomSheetSubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
        marginTop: 4,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    optionText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#74757C',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    radioButtonActive: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    stepperContainer: {
        alignItems: 'flex-start',
        marginBottom: 48,
        marginTop: 10,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        paddingHorizontal: 6,
        paddingVertical: 6,
        gap: 20,
    },
    stepperButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperValue: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        minWidth: 20,
        textAlign: 'center',
    },
    modalContinueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContinueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
