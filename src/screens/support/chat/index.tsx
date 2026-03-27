import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as NativeSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportChatScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [message, setMessage] = useState('');

    return (
        <NativeSafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryWhite }}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.main_dark} />
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Chat With Us</Text>
                    <Text style={styles.subtitle}>
                        Hold tight! We'll connect you with a chat agent as soon as possible.
                    </Text>

                    <View style={styles.chatArea}>
                        {/* Sample User Messages */}
                        <View style={styles.messageRow}>
                            <View style={styles.userBubble}>
                                <Text style={styles.userMessageText}>
                                    The driver that I sent to make a delivery didn't show.
                                </Text>
                                <Text style={styles.timestamp}>10:36 am</Text>
                            </View>
                        </View>

                        <View style={styles.messageRow}>
                            <View style={styles.userBubble}>
                                <Text style={styles.userMessageText}>
                                    Can you help me track him. He's name is Miracle Emeka.
                                </Text>
                                <Text style={styles.timestamp}>10:36 am</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Message Input Area */}
                <View style={styles.inputArea}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message"
                            placeholderTextColor={COLORS.secondaryGray}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
                            <Ionicons name="send" size={20} color={COLORS.primaryWhite} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </NativeSafeAreaView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
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
        borderColor: COLORS.light_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.main_dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 20,
        marginBottom: 40,
    },
    chatArea: {
        gap: 12,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        maxWidth: '85%',
        borderBottomRightRadius: 2,
    },
    userMessageText: {
        fontSize: 15,
        color: COLORS.primaryWhite,
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputArea: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        backgroundColor: COLORS.primaryWhite,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.main_dark,
        maxHeight: 100,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
