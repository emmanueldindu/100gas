import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    Pressable,
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
import ScreenEnums from '../../../enums/screen-enums';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';
import { getStatesResult } from '../../../service/locations';
import NavigationHeader from '@/src/components/navigation-header';

export default function LocationScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'LOCATION'>>();
    
    const [selectedState, setSelectedState] = useState('');
    const [address, setAddress] = useState('');
    const [isStateModalVisible, setIsStateModalVisible] = useState(false);
    const [states, setStates] = useState<{id: string, name: string}[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            setIsLoadingStates(true);
            try {
                const res = await getStatesResult();
                if (res?.success && Array.isArray(res?.data)) {
                    setStates(res.data);
                }
            } catch (err) {
                console.log('Error fetching states', err);
            } finally {
                setIsLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    const toggleStateModal = () => setIsStateModalVisible(!isStateModalVisible);

    const handleSelectState = (stateName: string) => {
        setSelectedState(stateName);
        toggleStateModal();
    };

    const isReady = selectedState && address.length > 5;

    const handleContinue = () => {
        const payload = {
            ...route.params?.payload,
            state: selectedState,
            address: address,
            latitude: 6.5244,
            longitude: 3.3792,
        };
        navigation.navigate(ScreenEnums.CUSTOMER_TYPE_AUTH, { payload } as any);
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
                        title="Delivery Address" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.content}>
                        <Text style={styles.description}>
                            Set the address you want your orders delivered to.
                        </Text>
                        
                        <View style={styles.form}>
                            {/* State Selector */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>State</Text>
                                <TouchableOpacity 
                                    style={styles.selector}
                                    activeOpacity={0.7}
                                    onPress={toggleStateModal}
                                >
                                    <Text style={[
                                        styles.selectorText,
                                        !selectedState && { color: '#74757C' }
                                    ]}>
                                        {selectedState || 'Select state'}
                                    </Text>
                                    <Ionicons 
                                        name="chevron-down" 
                                        size={20} 
                                        color="#FFFFFF" 
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Address Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your address"
                                    placeholderTextColor="#74757C"
                                    value={address}
                                    onChangeText={setAddress}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Dummy GPS Link */}
                            <TouchableOpacity style={styles.gpsLink} activeOpacity={0.7}>
                                <Text style={styles.gpsText}>Use GPS Location Instead</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                            </TouchableOpacity>
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

            {/* State Selection Modal */}
            <Modal
                visible={isStateModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleStateModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={toggleStateModal} 
                    >
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHeader}>
                            <Text style={styles.bottomSheetTitle}>Select State</Text>
                            <TouchableOpacity onPress={toggleStateModal} style={styles.closeButton}>
                                <Image source={require("../../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        {isLoadingStates ? (
                            <ActivityIndicator color={COLORS.primary} style={{ paddingVertical: 40 }} />
                        ) : (
                            <FlatList
                                data={states}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.stateItem}
                                        activeOpacity={0.7}
                                        onPress={() => handleSelectState(item.name)}
                                    >
                                        <Text style={styles.stateName}>{item.name}</Text>
                                        <View style={[
                                            styles.radioButton,
                                            selectedState === item.name && styles.radioButtonActive
                                        ]}>
                                            {selectedState === item.name && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.divider} />}
                                style={{ maxHeight: 400 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: '#FFFFFF',
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
        fontSize: 13,
        color: COLORS.light_gray,
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
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#C2C2C2',
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_500_medium,
    },
    gpsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    gpsText: {
        fontSize: 14,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
        marginRight: 8,
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
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stateItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    stateName: {
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
});
