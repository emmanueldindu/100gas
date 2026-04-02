import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../../service/auth';
import Toast from 'react-native-toast-message';

const INPUT_BG = '#F5F4F7';
const UNDERLINE_COLOR = '#DD5844';

export default function UpdateNameScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');

    const { data: profileResponse, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });

    useEffect(() => {
        if (profileResponse?.data) {
            const user = profileResponse.data;
            const firstName = user.firstName === 'User' ? '' : (user.firstName || '');
            const lastName = user.lastName === 'None' ? '' : (user.lastName || '');
            const initialName = `${firstName} ${lastName}`.trim();
            setName(initialName);
        }
    }, [profileResponse]);

    const updateNameMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your name has been updated successfully.'
            });
            navigation.goBack();
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error?.message || 'Something went wrong. Please try again.'
            });
        }
    });

    const isReady = name.trim().length > 0 && !updateNameMutation.isPending;

    const handleUpdate = () => {
        if (!isReady) return;

        const parts = name.trim().split(/\s+/);
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ') || '';

        // Safely construct payload, removing any null, undefined or empty strings 
        // that might trigger "Invalid request data" validation errors.
        const payload: any = {};

        if (firstName) payload.firstName = firstName.trim();
        if (lastName) payload.lastName = lastName.trim();
        
        // Include other fields only if they have valid content
        if (profileResponse?.data?.email) payload.email = profileResponse.data.email;
        if (profileResponse?.data?.avatarUrl && profileResponse.data.avatarUrl.startsWith('http')) {
            payload.avatarUrl = profileResponse.data.avatarUrl;
        }
        
        // Use the customerType from profile or fallback to HOUSEHOLD
        payload.customerType = profileResponse?.data?.customerType || 'HOUSEHOLD';

        console.log('[UpdateName] Sending Patch:', JSON.stringify(payload, null, 2));
        updateNameMutation.mutate(payload);
    };

    return (
        <NativeSafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.innerContainer}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                    </TouchableOpacity>

                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {isLoadingProfile ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        ) : (
                            <View style={styles.content}>
                                <Text style={styles.title}>Update your name</Text>
                                
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Full Name"
                                            placeholderTextColor={COLORS.secondaryGray}
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                        />
                                        <View style={styles.underline} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {!isLoadingProfile && (
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity 
                                style={[styles.updateButton, !isReady && styles.disabledButton]}
                                activeOpacity={0.8}
                                disabled={!isReady}
                                onPress={handleUpdate}
                            >
                                {updateNameMutation.isPending ? (
                                    <ActivityIndicator color={COLORS.primaryWhite} />
                                ) : (
                                    <Text style={styles.updateText}>Update</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.primaryWhite,
    },
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    scrollContent: {
        flexGrow: 1,
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
    input: {
        backgroundColor: INPUT_BG,
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
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
    buttonWrapper: {
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
        backgroundColor: COLORS.primaryWhite,
    },
    updateButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    updateText: {
        color: COLORS.primaryWhite,
        fontSize: 18,
        fontWeight: '600',
    },
});
