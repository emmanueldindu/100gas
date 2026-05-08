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
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { RootStackNavigationProp } from '../../screens.types';

export default function UpdateLocationScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [selectedState, setSelectedState] = useState('');
    const [address, setAddress] = useState('');

    /* Commenting out implementation for now to focus on design
    const queryClient = useQueryClient();
    const { data: statesResponse, isLoading: isLoadingStates } = useQuery({ ... });
    const { data: addrResponse, isLoading: isLoadingAddress } = useQuery({ ... });
    const updateAddressMutation = useMutation({ ... });
    */

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Enter home address</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>State</Text>
                            <TouchableOpacity 
                                style={styles.input} 
                                activeOpacity={0.7}
                                onPress={() => {}}
                            >
                                <Text style={[styles.inputText, !selectedState && { color: '#74757C' }]}>
                                    {selectedState || 'Select state'}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 16 }]}
                                placeholder="Enter your address"
                                placeholderTextColor="#74757C"
                                value={address}
                                onChangeText={setAddress}
                                multiline
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.updateButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.updateText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
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
        borderColor: '#2F3338',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 48,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputText: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 50 : 60,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.garnet_600_semibold,
    },
});
