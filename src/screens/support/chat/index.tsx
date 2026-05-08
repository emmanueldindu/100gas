import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONT } from '../../../constants/fonts';
import { RootStackNavigationProp } from '../../screens.types';

export default function SupportChatScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [message, setMessage] = useState('');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            
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
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chat With Us</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.subtitle}>
                        Hold tight! We'll connect you with a chat agent as soon as possible.
                    </Text>

                    <View style={styles.chatArea}>
                        {/* Sample User Messages */}
                        <View style={styles.userMessageRow}>
                            <View style={styles.userBubble}>
                                <Text style={styles.messageText}>
                                    The driver that I sent to make a delivery didn't show.
                                </Text>
                                <Text style={styles.timestamp}>10:36 am</Text>
                            </View>
                        </View>

                        <View style={styles.userMessageRow}>
                            <View style={styles.userBubble}>
                                <Text style={styles.messageText}>
                                    Can you help me track him. He's name is Miracle Emeka.
                                </Text>
                                <Text style={styles.timestamp}>10:37 am</Text>
                            </View>
                        </View>

                        {/* Sample Agent Message */}
                        <View style={styles.agentMessageRow}>
                            <View style={styles.agentBubble}>
                                <Text style={styles.messageText}>
                                    Please can you wait while we run a quick check on our system.
                                </Text>
                                <Text style={styles.timestamp}>10:40 am</Text>
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
                            placeholderTextColor="#74757C"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
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
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
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
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        lineHeight: 22,
        marginBottom: 48,
    },
    chatArea: {
        gap: 20,
    },
    userMessageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    agentMessageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderRadius: 12,
        maxWidth: '85%',
        borderBottomRightRadius: 2,
    },
    agentBubble: {
        backgroundColor: '#2F3338',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderRadius: 12,
        maxWidth: '85%',
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 15,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 10,
        fontFamily: FONT.garnet_400_regular,
        color: 'rgba(255, 255, 255, 0.7)',
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    inputArea: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        paddingTop: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2F3338',
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 6,
        minHeight: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
        maxHeight: 100,
        paddingTop: Platform.OS === 'ios' ? 12 : 8,
        paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
