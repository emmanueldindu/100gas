import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ScreenEnums from '../../enums/screen-enums';
import HomeScreen from '../../screens/home';
import OrderHistoryScreen from '../../screens/order-history';
import ProfileScreen from '../../screens/profile';
import { COLORS } from '../../constants/colors';

const Tab = createBottomTabNavigator();

interface TabConfig {
    name: string;
    component: React.ComponentType<any>;
    label: string;
    icon: (focused: boolean) => any; // Returns the asset source
}

const TABS: TabConfig[] = [
    {
        name: ScreenEnums.HOME,
        component: HomeScreen,
        label: 'Home',
        icon: (focused) => focused 
            ? require('../../assets/icons/home-active.png') 
            : require('../../assets/icons/home-inactive.png'),
    },
    {
        name: ScreenEnums.ORDER_HISTORY,
        component: OrderHistoryScreen,
        label: 'Order History',
        icon: (focused) => focused ? require('../../assets/icons/order-active.png') : require('../../assets/icons/order-inactive.png'),
    },
    {
        name: ScreenEnums.PROFILE,
        component: ProfileScreen,
        label: 'Profile',
        icon: (focused) => focused 
            ? require('../../assets/icons/profile-active.png') 
            : require('../../assets/icons/profile-inactive.png'),
    },
];

export default function BottomTabs() {
    const { Navigator, Screen } = Tab;
    const insets = useSafeAreaInsets();

    const tabBarHeight = Platform.OS === 'ios'
        ? 80 + insets.bottom
        : 70 + insets.bottom;

    const tabBarOptions = {
        headerShown: false,
        tabBarStyle: {
            backgroundColor: COLORS.primaryWhite,
            borderTopWidth: 1,
            borderTopColor: '#F5F4F7',
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            paddingTop: 12,
            paddingHorizontal: 40, // Bring items significantly closer to the center
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500' as any,
            marginTop: 4,
        },
    };

    return (
        <Navigator
            initialRouteName={ScreenEnums.HOME}
            backBehavior={'none'}
            screenOptions={tabBarOptions}
        >
            {TABS.map((_tab, index) => (
                <Screen
                    name={_tab.name}
                    key={`${index}-${_tab.name}`}
                    component={_tab.component}
                    options={{
                        tabBarLabelPosition: 'below-icon',
                        tabBarLabel: _tab.label,
                        tabBarIcon: ({ focused }) => (
                            <Image 
                                source={_tab.icon(focused)} 
                                style={[
                                    styles.icon,
                                    // Tint the fallback order icon if it's active so it still looks red
                                    _tab.name === ScreenEnums.ORDER_HISTORY && focused && { tintColor: COLORS.primary }
                                ]} 
                                resizeMode="contain"
                            />
                        ),
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                {...(props as any)}
                                activeOpacity={0.8}
                                onPress={(e) => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light
                                    );
                                    props.onPress?.(e as any);
                                }}
                            />
                        ),
                    }}
                />
            ))}
        </Navigator>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});
