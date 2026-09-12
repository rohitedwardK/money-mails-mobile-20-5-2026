import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';
import {layout, spacing, typography} from '../../../utils/theme';

export const useCategoryPageStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors: colors} = getColors();
  const pageHorizontalPadding = layout.screenPadding;

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingBottom: layout.footerHeight + spacing.lg,
    },
    screenHeader: {
      paddingHorizontal: pageHorizontalPadding,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    screenTitle: {
      ...typography.title,
      color: colors.fontPrimary,
    },
    screenSubtitle: {
      ...typography.bodySm,
      color: colors.fontMuted,
      marginTop: spacing.xs,
    },
    searchBand: {
      width: screenWidth,
      paddingHorizontal: pageHorizontalPadding,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: colors.highlightPrimary,
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfacePrimary,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    searchIcon: {
      position: 'absolute',
      left: 14,
      zIndex: 1,
      top: 10,
    },
    searchInput: {
      width: '100%',
      height: '100%',
      color: colors.fontPrimary,
      paddingVertical: 10,
      borderRadius: 22,
      paddingRight: 16,
      paddingLeft: 44,
      fontSize: 14,
      fontWeight: '600',
    },
    listContent: {
      paddingHorizontal: pageHorizontalPadding,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxxl,
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
      ...typography.titleSm,
      color: colors.fontPrimary,
      textAlign: 'center',
      marginTop: spacing.lg,
    },
    emptySubtitle: {
      ...typography.bodySm,
      color: colors.fontMuted,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    favIcon: {
      color: colors.white,
    },
  });
};
