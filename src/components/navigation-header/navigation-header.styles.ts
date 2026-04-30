import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT } from '../../constants/fonts';

const NavigationHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
    minHeight: 56,
  },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2F3338',
  },
  title: {
    fontSize: 18,
    color: COLORS.primaryWhite,
    fontFamily: FONT.garnet_500_medium,
  },
  rightElementContainer: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default NavigationHeaderStyles;
