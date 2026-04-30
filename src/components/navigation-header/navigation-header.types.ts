import { ViewStyle, TextStyle } from 'react-native';

export interface INavigationHeaderProps {
  title?: string;
  hideNavigation?: boolean;
  onBackPressAction?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  iconColor?: string;
  rightHeaderElement?: React.ReactNode;
}
