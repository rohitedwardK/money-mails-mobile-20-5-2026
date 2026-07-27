import {StyleSheet} from 'react-native';
import getColors from '../../utils/colors';

export const styles = () => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    appBackground: {
      flex: 1,
      backgroundColor: colors.homeBackground || colors.bgPrimary,
    },
    appBackgroundFill: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.homeBackground || colors.bgPrimary,
    },
    appBackgroundImageBand: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 260,
      backgroundColor: colors.homeBackground || colors.bgPrimary,
      overflow: 'hidden',
    },
    appBackgroundImage: {
      width: '100%',
      height: '100%',
      opacity: 0.12,
    },
    safeArea: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    root: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    screenWithFooter: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    screenContentWithFooter: {
      flex: 1,
      paddingBottom: 18,
    },
    footerNav: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: 0,
      height: 62,
      paddingTop: 6,
      paddingBottom: 5,
      paddingHorizontal: 6,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: colors.borderSubtle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowOpacity: 0,
      elevation: 0,
    },
    footerNavItem: {
      flex: 1,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerIconWrap: {
      width: 30,
      height: 25,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    footerIconWrapActive: {
      backgroundColor: colors.brandSoft,
    },
    footerNavLabel: {
      color: colors.fontMuted,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '700',
      marginTop: 2,
    },
    footerNavLabelActive: {
      color: colors.highlightPrimary,
    },
    pageContainer: {
      backgroundColor: 'transparent',
    },
    tabBar: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 14,
      height: 68,
      paddingTop: 8,
      paddingBottom: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.surfaceElevated,
      borderTopWidth: 1,
      borderTopColor: colors.borderSubtle,
      borderRadius: 18,
      shadowOpacity: 0,
      elevation: 0,
    },
    tabBarItem: {
      borderRadius: 14,
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0,
    },
    notificationBadgeWrapper: {
      position: 'absolute',
      top: -5,
      right: -9,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.success,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surfaceElevated,
    },
    notificationBadgeText: {
      fontSize: 10,
      color: colors.white,
      fontWeight: '700',
    },
    drawerHeader: {
      backgroundColor: colors.highlightPrimary,
      paddingTop: 70,
      paddingHorizontal: 18,
      paddingBottom: 28,
      flexDirection: 'row',
      alignItems: 'center',
    },
    drawerNameWrapper: {
      marginLeft: 22,
      flex: 1,
      justifyContent: 'flex-start',
    },
    drawerName: {
      fontSize: 22,
      lineHeight: 28,
      color: colors.white,
      fontWeight: '700',
    },
    drawerBody: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      paddingBottom: 36,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 13,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginVertical: 2,
    },
    drawerItemText: {
      paddingLeft: 14,
      color: colors.fontSecondary,
      fontSize: 15,
      fontWeight: '600',
    },
    drawerIcon: {
      color: colors.highlightPrimary,
    },
    locationContent: {
      paddingBottom: 10,
    },
    locationInput: {
      marginTop: 16,
      backgroundColor: colors.surfacePrimary,
      borderColor: colors.borderPrimary,
      borderWidth: 1,
      borderRadius: 14,
      minHeight: 48,
    },
    locationActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 18,
    },
    locationActionButton: {
      width: '48%',
      height: 44,
    },
    headerBackButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brandSoft,
    },
    stackContent: {
      backgroundColor: 'transparent',
    },
    btnText: {},
  });
};
