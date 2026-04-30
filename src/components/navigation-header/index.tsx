import React, { FC } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INavigationHeaderProps } from './navigation-header.types';
import NavigationHeaderStyles from './navigation-header.styles';
import { COLORS } from '../../constants/colors';

const NavigationHeader: FC<INavigationHeaderProps> = props => {
  const {
    title,
    hideNavigation = false,
    onBackPressAction,
    style,
    titleStyle,
    iconColor = COLORS.primaryWhite,
    rightHeaderElement,
  } = props;

  return (
    <View style={[NavigationHeaderStyles.header, style]}>
      {/* Centered Title */}
      <View style={NavigationHeaderStyles.titleContainer} pointerEvents="none">
        {title && (
          <Text
            style={[NavigationHeaderStyles.title, titleStyle]} 
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Left Back Button */}
      {!hideNavigation ? (
        <TouchableOpacity
          onPress={onBackPressAction}
          hitSlop={20}
          activeOpacity={0.7}
          style={NavigationHeaderStyles.navIconContainer}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 44 }} />
      )}

      {/* Right Element (or Empty for symmetry) */}
      <View style={NavigationHeaderStyles.rightElementContainer}>
        {rightHeaderElement || null}
      </View>
    </View>
  );
};

export default NavigationHeader;
