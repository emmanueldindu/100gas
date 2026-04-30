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
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
    const [showDropdown, setShowDropdown] = useState(false);
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

    const isReady = selectedState && address.length > 5;

    const handleContinue = () => {
        const payload = {
            ...route.params?.payload,
            state: selectedState,
            address: address,
            latitude: 6.5244,
            longitude: 3.3792,
        };
        navigation.navigate(ScreenEnums.GAS_SIZE, { payload } as any);
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
                                    onPress={() => setShowDropdown(!showDropdown)}
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

                                {showDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        {isLoadingStates ? (
                                            <ActivityIndicator color={COLORS.primary} style={{ padding: 10 }} />
                                        ) : (
                                            <FlatList
                                                data={states}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity 
                                                        style={styles.dropdownItem}
                                                        onPress={() => {
                                                            setSelectedState(item.name);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <Text style={styles.itemText}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                style={{ maxHeight: 200 }}
                                                nestedScrollEnabled={true}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Address Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your address"
                                    placeholderTextColor="#2F3338"
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
    dropdownMenu: {
        marginTop: 4,
        backgroundColor: '#1E1E1E',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2F3338',
        maxHeight: 200,
        zIndex: 1000,
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
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#C2C2C2',
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.primaryWhite,
        fontFamily: FONT.garnet_400_regular,
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
});
