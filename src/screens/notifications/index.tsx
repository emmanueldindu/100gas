import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';
import { RootStackNavigationProp } from '../screens.types';

interface NotificationItemProps {
    title: string;
    description: string;
    icon: any;
}

const NotificationItem = ({ title, description, icon }: NotificationItemProps) => (
    <View style={styles.notificationItem}>
        <View style={styles.iconContainer}>
            <Image source={icon} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.notificationTitle}>{title}</Text>
            <Text style={styles.notificationDescription}>{description}</Text>
        </View>
    </View>
);

const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

export default function NotificationsScreen() {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <SectionHeader title="Today" />
                
                <NotificationItem 
                    title="Driver is on the way"
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/driver.png')}
                />
                <View style={styles.divider} />
                
                <NotificationItem 
                    title="Driver is on the way"
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/driver.png')}
                />
                <View style={styles.divider} />

                <NotificationItem 
                    title="Your scheduled delivery date is today."
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/calendar.png')}
                />
                <View style={styles.divider} />

                <NotificationItem 
                    title="Flash Sale Ending Soon"
                    description="Hurry! Enjoy discounted gas refills before midnight."
                    icon={require('../../assets/icons/alarm.png')}
                />
                <View style={styles.divider} />

                <NotificationItem 
                    title="New Login Detected"
                    description="A new device just logged into your account."
                    icon={require('../../assets/icons/login-alert.png')}
                />
                <View style={styles.divider} />

                <View style={{ marginTop: 24 }}>
                    <SectionHeader title="Yesterday" />
                </View>

                <NotificationItem 
                    title="Driver is on the way"
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/driver.png')}
                />
                <View style={styles.divider} />

                <NotificationItem 
                    title="Driver is on the way"
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/driver.png')}
                />
                <View style={styles.divider} />

                <NotificationItem 
                    title="Your scheduled delivery date is today."
                    description="Your gas delivery is arriving soon."
                    icon={require('../../assets/icons/calendar.png')}
                />
                <View style={styles.divider} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlack,
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
        paddingBottom: 40,
    },
    sectionHeader: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONT.garnet_400_regular,
        color: '#74757C',
    },
    notificationItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontFamily: FONT.garnet_600_semibold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 16,
        fontFamily: FONT.garnet_400_regular,
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 20,
    },
});
