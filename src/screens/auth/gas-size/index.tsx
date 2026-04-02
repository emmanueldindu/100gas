import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    Pressable,
    Dimensions,
    Animated,
    FlatList
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { AuthStackNavigationProp, AuthStackParamList } from '../../../navigation/auth-stack/auth-stack.types';
import ScreenEnums from '../../../enums/screen-enums';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_GAP = 12;
const ITEM_SIZE = CARD_WIDTH + CARD_GAP;
const SPACER_WIDTH = (width - ITEM_SIZE) / 2;

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

const CUSTOMER_TYPES = [
    'Household',
    'Restaurant',
    'Small Depot',
    'Organization'
];

const GAS_SIZES = [
    { key: 'left-spacer' },
    { key: '1-5kg', display: '3kg cylinder' },
    { key: '6-9kg', display: '6kg cylinder' },
    { key: '12.5-13kg', display: '12.5kg cylinder' },
    { key: '19-25kg', display: '25kg cylinder' },
    { key: '45-50kg', display: '50kg cylinder' },
    { key: 'right-spacer' },
];

const ACTUAL_SIZES = GAS_SIZES.filter(s => !s.key.includes('spacer'));

export default function GasSizeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuthStackNavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, 'GAS_SIZE'>>();
    
    const [selectedType, setSelectedType] = useState('Household');
    const [showDropdown, setShowDropdown] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isReady = !!selectedType;

    const handleContinue = () => {
        const itemKey = ACTUAL_SIZES[activeIndex]?.key || '1-5kg';
        let sizeCode = "KG_3";
        if (itemKey === '1-5kg') sizeCode = "KG_3";
        else if (itemKey === '6-9kg') sizeCode = "KG_6";
        else if (itemKey === '12.5-13kg') sizeCode = "KG_12_5";
        else if (itemKey === '19-25kg') sizeCode = "KG_25";
        else if (itemKey === '45-50kg') sizeCode = "KG_50";

        const typeFormatted = selectedType.toUpperCase().replace(' ', '_');

        const payload = {
            ...route.params?.payload,
            customerType: typeFormatted,
            cylinderData: [{ size: sizeCode }]
        };

        navigation.navigate(ScreenEnums.CYLINDER_COUNT, { payload } as any);
    };

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    const handleNext = () => {
        if (activeIndex < ACTUAL_SIZES.length - 1) {
            flatListRef.current?.scrollToOffset({
                offset: (activeIndex + 1) * ITEM_SIZE,
                animated: true
            });
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            flatListRef.current?.scrollToOffset({
                offset: (activeIndex - 1) * ITEM_SIZE,
                animated: true
            });
        }
    };

    const renderItem = ({ item, index }: any) => {
        if (item.key.includes('spacer')) {
            return <View style={{ width: SPACER_WIDTH }} />;
        }

        const actualIndex = index - 1;
        const inputRange = [
            (actualIndex - 1) * ITEM_SIZE,
            actualIndex * ITEM_SIZE,
            (actualIndex + 1) * ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[
                styles.itemContainer,
                { transform: [{ scale }], opacity }
            ]}>
                <View style={styles.card}>
                    <Image 
                        source={require('../../../assets/images/gasimg.png')}
                        style={styles.gasImage}
                        contentFit="contain"
                    />
                    <Text style={styles.cylinderLabel}>{item.display}</Text>
                </View>
            </Animated.View>
        );
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
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <Text style={styles.title}>Select your gas cylinder size</Text>
                        
                        <View style={styles.form}>
                            <View style={[styles.inputGroup, { zIndex: showDropdown ? 100 : 1 }]}>
                                <Text style={styles.label}>Customer Type</Text>
                                <TouchableOpacity 
                                    style={styles.dropdownTrigger}
                                    activeOpacity={0.7}
                                    onPress={() => setShowDropdown(!showDropdown)}
                                >
                                    <View style={styles.dropdownContent}>
                                        <Text style={styles.dropdownText}>
                                            {selectedType || 'Select customer type'}
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
                                            {CUSTOMER_TYPES.map((type, index) => (
                                                <TouchableOpacity 
                                                    key={type}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selectedType === type && styles.selectedItem,
                                                        index === CUSTOMER_TYPES.length - 1 && { borderBottomWidth: 0 }
                                                    ]}
                                                    onPress={() => {
                                                        setSelectedType(type);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.itemText,
                                                        selectedType === type && styles.selectedItemText
                                                    ]}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </View>

                            <View style={[styles.carouselContainer, { width: width, marginLeft: -24 }]}>
                                <Animated.FlatList
                                    ref={flatListRef}
                                    data={GAS_SIZES}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.key}
                                    snapToInterval={ITEM_SIZE}
                                    decelerationRate="fast"
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                    contentContainerStyle={styles.flatListContent}
                                    onMomentumScrollEnd={(e) => {
                                        const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_SIZE);
                                        setActiveIndex(index);
                                    }}
                                    renderItem={renderItem}
                                />

                                <View style={styles.controlsOverlay}>
                                    <TouchableOpacity 
                                        style={[styles.arrowButton, activeIndex === 0 && styles.disabledArrow]}
                                        onPress={handlePrev}
                                        disabled={activeIndex === 0}
                                    >
                                        <Ionicons name="chevron-back" size={24} color={COLORS.primaryWhite} />
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[styles.arrowButton, activeIndex === ACTUAL_SIZES.length - 1 && styles.disabledArrow]}
                                        onPress={handleNext}
                                        disabled={activeIndex === ACTUAL_SIZES.length - 1}
                                    >
                                        <Ionicons name="chevron-forward" size={24} color={COLORS.primaryWhite} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                             <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.continueButton, !isReady && styles.disabledButton]}
                                    activeOpacity={0.8}
                                    disabled={!isReady}
                                    onPress={handleContinue}
                                >
                                    <Text style={styles.continueText}>Continue</Text>
                                </TouchableOpacity>
                             </View>
                        </View>
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
        fontSize: 23,
        fontWeight: '600',
        color: '#2F3338',
        lineHeight: 36,
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
        color: COLORS.black,
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
        color: COLORS.black,
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
        color: COLORS.black,
    },
    selectedItemText: {
        fontWeight: '600',
        color: COLORS.black,
    },
    underline: {
        height: 1,
        backgroundColor: UNDERLINE_COLOR,
        marginTop: -1,
        marginHorizontal: 4,
    },
    carouselContainer: {
        marginVertical: 40,
        height: 350,
        justifyContent: 'center',
    },
    flatListContent: {
        alignItems: 'center',
    },
    itemContainer: {
        width: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsOverlay: {
        position: 'absolute',
        top: '50%',
        left: 24, // Account for the negative margin offset to keep arrows at padding level
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        marginTop: -22,
        zIndex: 10,
    },
    buttonContainer: {
        paddingHorizontal: 0,
    },
    arrowButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledArrow: {
        backgroundColor: COLORS.secondaryGray,
        shadowOpacity: 0,
        elevation: 0,
    },
    card: {
        width: CARD_WIDTH,
        height: 318,
        borderRadius: 24,
        backgroundColor: COLORS.primaryWhite,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // Premium Shadow
        shadowColor: '#DD5844',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.14,
        shadowRadius: 30,
        elevation: 10,
    },
    gasImage: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    cylinderLabel: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2F3338',
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    continueText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
