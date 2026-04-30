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
    Modal,
    ActivityIndicator,
    FlatList,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';
import { getStatesResult } from '../../../service/locations';
import { getAddressesResult, updateAddressResult, createAddressResult } from '../../../service/addresses';
import Toast from 'react-native-toast-message';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

// We'll fetch these from the API instead
const SkeletonItem = () => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <View style={styles.skeletonContainer}>
            <Animated.View style={[styles.skeletonLabel, { opacity }]} />
            <Animated.View style={[styles.skeletonInput, { opacity }]} />
            <Animated.View style={[styles.skeletonUnderline, { opacity }]} />
        </View>
    );
};

export default function UpdateLocationScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const queryClient = useQueryClient();
    const [selectedState, setSelectedState] = useState('');
    const [address, setAddress] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [addressId, setAddressId] = useState<string | null>(null);

    // Fetch states
    const { data: statesResponse, isLoading: isLoadingStates } = useQuery({
        queryKey: ['states'],
        queryFn: getStatesResult,
        staleTime: 1000 * 60 * 30, // 30 mins
    });

    // Fetch addresses
    const { data: addrResponse, isLoading: isLoadingAddress } = useQuery({
        queryKey: ['addresses'],
        queryFn: getAddressesResult,
    });

    const states = statesResponse?.data || [];

    useEffect(() => {
        if (addrResponse?.success && Array.isArray(addrResponse?.data) && addrResponse.data.length > 0) {
            const defaultAddr = addrResponse.data.find((a: any) => a.isDefault) || addrResponse.data[0];
            setAddressId(defaultAddr.id);
            setAddress(defaultAddr.address || '');
            setSelectedState(defaultAddr.state || '');
        }
    }, [addrResponse]);

    const updateAddressMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (addressId) {
                return updateAddressResult(addressId, payload);
            } else {
                return createAddressResult(payload);
            }
        },
        onSuccess: (res) => {
            if (res?.success) {
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: addressId ? 'Address updated successfully' : 'Address created successfully'
                });
                setIsConfirmModalVisible(false);
                navigation.goBack();
            }
        },
        onError: (err: any) => {
            console.error('Error saving address', err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: err?.message || 'Failed to save address'
            });
        }
    });

    const isReady = selectedState && address.length > 5 && !updateAddressMutation.isPending;

    const toggleConfirmModal = () => setIsConfirmModalVisible(!isConfirmModalVisible);

    const handleUpdate = () => {
        setIsConfirmModalVisible(true);
    };

    const handleConfirmLocation = () => {
        const payload: any = {
            label: 'Home',
            address: address,
            state: selectedState,
            latitude: 90,
            // longitude: 180, // "no longitude for now sha"
            isDefault: true
        };
        
        updateAddressMutation.mutate(payload);
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={styles.title}>Enter home address</Text>
                        
                        {isLoadingAddress ? (
                            <View style={styles.form}>
                                <SkeletonItem />
                                <SkeletonItem />
                                <View style={[styles.updateButton, { opacity: 0.2, marginTop: 250 }]} />
                            </View>
                        ) : (
                            <View style={styles.form}>
                            {/* State Dropdown */}
                            <View style={[styles.inputGroup, { zIndex: showDropdown ? 100 : 1 }]}>
                                <Text style={styles.label}>State</Text>
                                <TouchableOpacity 
                                    style={styles.dropdownTrigger}
                                    activeOpacity={0.7}
                                    onPress={() => setShowDropdown(!showDropdown)}
                                >
                                    <View style={styles.dropdownContent}>
                                        <Text style={[
                                            styles.dropdownText,
                                            !selectedState && { color: COLORS.secondaryGray }
                                        ]}>
                                            {selectedState || 'Select state'}
                                        </Text>
                                        <Ionicons 
                                            name={showDropdown ? "chevron-up" : "chevron-down"} 
                                            size={20} 
                                            color={COLORS.black} 
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.underline} />

                                {showDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        {isLoadingStates ? (
                                            <View style={{ padding: 20, alignItems: 'center' }}>
                                                <ActivityIndicator color={COLORS.primary} />
                                            </View>
                                        ) : (
                                            <FlatList
                                                data={states}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity 
                                                        style={[
                                                            styles.dropdownItem,
                                                            selectedState === item.name && styles.selectedItem,
                                                            index === states.length - 1 && { borderBottomWidth: 0 }
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedState(item.name);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <Text style={[
                                                            styles.itemText,
                                                            selectedState === item.name && styles.selectedItemText
                                                        ]}>
                                                            {item.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                                style={{ maxHeight: 250 }}
                                                nestedScrollEnabled={true}
                                                showsVerticalScrollIndicator={true}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Address Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your address"
                                        placeholderTextColor={COLORS.secondaryGray}
                                        value={address}
                                        onChangeText={setAddress}
                                        multiline={false}
                                    />
                                </View>
                                <View style={styles.underline} />
                            </View>

                            <TouchableOpacity 
                                style={[styles.updateButton, !isReady && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.updateText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Confirm Location Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isConfirmModalVisible}
                onRequestClose={toggleConfirmModal}
            >
                <Pressable style={styles.modalOverlay} onPress={toggleConfirmModal}>
                    <View style={styles.confirmModalContent}>
                        <View style={styles.modalInner}>
                            <Text style={styles.confirmTitle}>{address}</Text>
                            <Text style={styles.confirmSubtitle}>
                                Your gas will be delivered to {address} whenever you order for gas refill.
                            </Text>

                            <TouchableOpacity 
                                style={styles.confirmButton}
                                activeOpacity={0.8}
                                disabled={updateAddressMutation.isPending}
                                onPress={handleConfirmLocation}
                            >
                                {updateAddressMutation.isPending ? (
                                    <ActivityIndicator color={COLORS.primaryWhite} />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirm location</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
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
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginTop: 10,
    },
    content: {
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 48,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        color: COLORS.main_dark,
        fontWeight: '500',
        marginBottom: 12,
        textAlign: 'center',
    },
    dropdownTrigger: {
        backgroundColor: INPUT_BG,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.main_dark,
    },
    dropdownOverlay: {
        position: 'absolute',
        top: -500,
        left: -100,
        right: -100,
        bottom: -1000,
        zIndex: 500,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        backgroundColor: COLORS.primaryWhite,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 1000,
        padding: 8,
    },
    dropdownItem: {
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    selectedItem: {
        backgroundColor: '#FFF5F4',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.main_dark,
    },
    selectedItemText: {
        fontWeight: '600',
        color: COLORS.main_dark,
    },
    inputWrapper: {
        backgroundColor: INPUT_BG,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    input: {
        fontSize: 16,
        color: COLORS.main_dark,
        textAlign: 'center',
    },
    underline: {
        height: 1,
        backgroundColor: UNDERLINE_COLOR,
        marginTop: -1,
        marginHorizontal: 4,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250,
    },
    disabledButton: {
        opacity: 0.6,
    },
    updateText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    confirmModalContent: {
        backgroundColor: COLORS.primaryWhite,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    modalInner: {
        width: '100%',
    },
    confirmTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    confirmSubtitle: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 22,
        marginBottom: 32,
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    skeletonContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    skeletonLabel: {
        width: 60,
        height: 16,
        backgroundColor: '#EEEEEE',
        borderRadius: 4,
        marginBottom: 12,
    },
    skeletonInput: {
        width: '100%',
        height: 56,
        backgroundColor: '#F5F4F7',
        borderRadius: 12,
    },
    skeletonUnderline: {
        width: '100%',
        height: 1,
        backgroundColor: UNDERLINE_COLOR,
        opacity: 0.3,
        marginTop: -1,
        paddingHorizontal: 4,
    },
});
