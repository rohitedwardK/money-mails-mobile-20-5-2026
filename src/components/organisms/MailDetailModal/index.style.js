import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';
import {spacing, typography, elevation} from '../../../utils/theme';

export const mailDetailStyles = ({screenWidth, screenHeight}) => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      backgroundColor: colors.surfacePrimary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
      ...elevation.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 56,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSubtle,
      backgroundColor: colors.surfacePrimary,
    },
    backButton: {
      backgroundColor: colors.highlightPrimary,
      borderRadius: 14,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    waitText: {
      flex: 1,
      ...typography.body,
      color: colors.fontPrimary,
      textAlign: 'center',
      fontWeight: '700',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    storeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.homeCardMuted,
      borderRadius: colors.radiusLg,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    storeLogo: {
      width: 56,
      height: 56,
      borderRadius: colors.radiusMd,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfacePrimary,
      marginRight: spacing.md,
    },
    storeInfo: {
      flex: 1,
      minWidth: 0,
    },
    storeName: {
      ...typography.label,
      fontSize: 14,
      color: colors.fontPrimary,
      marginBottom: spacing.xs,
    },
    subject: {
      ...typography.bodySm,
      fontWeight: '700',
      color: colors.fontSecondary,
      marginBottom: spacing.sm,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    badge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginRight: spacing.sm,
      marginTop: spacing.xs,
    },
    badgePaid: {
      backgroundColor: colors.orangeSoft,
      borderWidth: 1,
      borderColor: 'rgba(255, 90, 20, 0.2)',
    },
    badgeRegular: {
      backgroundColor: colors.brandSoft,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    badgeText: {
      ...typography.caption,
      color: colors.fontSecondary,
      textTransform: 'uppercase',
    },
    amountBadge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'rgba(255, 184, 51, 0.18)',
      marginTop: spacing.xs,
    },
    amountText: {
      ...typography.caption,
      color: '#92400e',
    },
    messageSection: {
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: colors.surfacePrimary,
      borderRadius: colors.radiusMd,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    mediaSection: {
      width: '100%',
      borderRadius: colors.radiusLg,
      overflow: 'hidden',
      backgroundColor: colors.homeCardMuted,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    mailImage: {
      width: screenWidth - 34,
      height: Math.min(screenHeight * 0.42, 400),
    },
    htmlContainer: {
      width: '100%',
      backgroundColor: colors.surfacePrimary,
      borderRadius: colors.radiusLg,
      overflow: 'hidden',
    },
    pdfContainer: {
      width: '100%',
      backgroundColor: colors.surfacePrimary,
    },
    videoContainer: {
      width: '100%',
      minHeight: 220,
    },
    emptyMedia: {
      padding: spacing.xxxl,
      alignItems: 'center',
    },
    emptyMediaText: {
      ...typography.bodySm,
      color: colors.fontMuted,
    },
  });
};
