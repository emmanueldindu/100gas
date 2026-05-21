import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    StatusBar,
    Modal,
    FlatList
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import ScreenEnums from '../../../enums/screen-enums';
import NavigationHeader from '../../../components/navigation-header';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';

const CUSTOMER_TYPES = [
    'Household (Personal use)',
    'Restaurant (Commercial kitchen)',
    'Small Depot (Reseller)',
    'Organization (Company / Institution)'
];

const CUSTOMER_TYPE_MAP: Record<string, string> = {
    'Household (Personal use)': 'HOUSEHOLD',
    'Restaurant (Commercial kitchen)': 'RESTAURANT',
    'Small Depot (Reseller)': 'SMALL_DEPOT',
    'Organization (Company / Institution)': 'ORGANIZATION'
};

export default function CustomerTypeAuthScreen() {
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'CUSTOMER_TYPE_AUTH'>>();
    
    const [selectedType, setSelectedType] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => setIsModalVisible(!isModalVisible);

    const handleSelect = (type: string) => {
        setSelectedType(type);
        toggleModal();
    };

    const isReady = selectedType !== '';

    const handleContinue = () => {
        const payload = {
            ...route.params?.payload,
            customerType: CUSTOMER_TYPE_MAP[selectedType] || 'HOUSEHOLD',
        };
        navigation.navigate(ScreenEnums.GAS_SIZE, { payload } as any);
    };

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryBlack }}>
            <StatusBar barStyle="light-content" />
            
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
                        title="Customer Type" 
                        onBackPressAction={() => navigation.goBack()}
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.content}>
                        <Text style={styles.label}>What Best Describes You?</Text>

                        <TouchableOpacity 
                            style={styles.selector} 
                            activeOpacity={0.7}
                            onPress={toggleModal}
                        >
                            <Text style={[styles.selectorText, !selectedType && { color: '#74757C' }]}>
                                {selectedType || 'Select customer type'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
            </KeyboardAvoidingView>

            {/* Selection Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.backdrop} 
                        activeOpacity={1} 
                        onPress={toggleModal} 
                    >
                        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                    </TouchableOpacity>
                    
                    <View style={styles.bottomSheet}>
                        <View style={styles.bottomSheetHeader}>
                            <View>
                                <Text style={styles.bottomSheetTitle}>Select Customer Type</Text>
                                <Text style={styles.bottomSheetSubtitle}>Choose what best describes you?</Text>
                            </View>
                            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                                <Image source={require("../../../assets/icons/close.png")} style={{
                                    width: 24,
                                    height: 24,
                                }}/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={CUSTOMER_TYPES}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.optionItem}
                                    activeOpacity={0.7}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                    <View style={[
                                        styles.radioButton,
                                        selectedType === item && styles.radioButtonActive
                                    ]}>
                                        {selectedType === item && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.divider} />}
                        />
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
    footer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 50 : 30,
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
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    bottomSheetSubtitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
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
        paddingVertical: 20,
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
});
