import React, { useState } from 'react';
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
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

const STATES = [
    'Lagos',
    'Abuja (FCT)',
    'Rivers',
    'Enugu',
    'Delta'
];

export default function UpdateLocationScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const [selectedState, setSelectedState] = useState('');
    const [address, setAddress] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const isReady = selectedState && address.length > 5;

    const toggleConfirmModal = () => setIsConfirmModalVisible(!isConfirmModalVisible);

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
                                    <>
                                        <Pressable 
                                            style={styles.dropdownOverlay} 
                                            onPress={() => setShowDropdown(false)} 
                                        />
                                        <View style={styles.dropdownMenu}>
                                            {STATES.map((state, index) => (
                                                <TouchableOpacity 
                                                    key={state}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selectedState === state && styles.selectedItem,
                                                        index === STATES.length - 1 && { borderBottomWidth: 0 }
                                                    ]}
                                                    onPress={() => {
                                                        setSelectedState(state);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.itemText,
                                                        selectedState === state && styles.selectedItemText
                                                    ]}>
                                                        {state}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </>
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
                                onPress={toggleConfirmModal}
                            >
                                <Text style={styles.updateText}>Update</Text>
                            </TouchableOpacity>
                        </View>
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
                            <Text style={styles.confirmTitle}>Mercyland Estate, Owerri</Text>
                            <Text style={styles.confirmSubtitle}>
                                You gas will be delivered to Mercyland Estate, Owerri whenever you order for gas refill.
                            </Text>

                            <TouchableOpacity 
                                style={styles.confirmButton}
                                activeOpacity={0.8}
                                onPress={() => {
                                    toggleConfirmModal();
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.confirmButtonText}>Confirm location</Text>
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
});
