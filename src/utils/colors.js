import { useContext } from 'react';
import { DeviceContext } from '../context/DeviceContext';

const colors = isDarkMode => ({
  accent: '#00AEEF',
  white: !isDarkMode ? '#ffffff' : '#FAF9F6',
  black: '#000000',
  highlightPrimary: '#20A64A',
  bgPrimary: !isDarkMode ? '#F7FAF8' : '#18211F',
  bgSecondary: !isDarkMode ? '#F2F7F3' : '#202B2A',
  surfacePrimary: !isDarkMode ? '#FFFFFF' : '#263330',
  surfaceSecondary: !isDarkMode ? '#F8FBF8' : '#2D3A37',
  surfaceElevated: !isDarkMode ? '#FFFFFF' : '#30413D',
  brandSoft: !isDarkMode ? '#EAF8EE' : 'rgba(32, 166, 74, 0.18)',
  accentSoft: !isDarkMode ? '#EAF8FF' : 'rgba(0, 174, 239, 0.16)',
  fontPrimary: !isDarkMode ? '#17201A' : '#ffffff',
  fontSecondary: !isDarkMode ? '#475467' : '#D0D7D5',
  fontMuted: !isDarkMode ? '#667085' : '#AEBAB6',
  fontPrimaryInvert: isDarkMode ? '#000000' : '#ffffff',
  cardsPlaceholder: !isDarkMode ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
  statusbarUserPrimaryColor: !isDarkMode ? '#50AB32' : '#50AB32',
  borderPrimary: !isDarkMode ? '#DDE8EE' : 'rgba(250, 249, 246, 0.18)',
  borderSubtle: !isDarkMode ? '#E9F0EA' : 'rgba(250, 249, 246, 0.1)',
  shadowColor: !isDarkMode ? '#1F4B2E' : '#000000',
  success: '#20A64A',
  warning: '#FFB833',
  danger: '#D92D20',
  homeBackground: !isDarkMode ? '#F2F8EF' : '#18211F',
  homeBand: !isDarkMode ? '#FFFFFF' : '#202B2A',
  homeSection: !isDarkMode ? '#F2F7F3' : '#202B2A',
  homeCard: !isDarkMode ? '#FFFFFF' : '#263330',
  homeCardMuted: !isDarkMode ? '#F6FAF6' : '#2D3A37',
  orangePrimary: '#FF5A14',
  orangeSoft: '#FFF0E8',
  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 18,
  radiusXl: 22,
  transparentDrawer: 'rgba(0, 0, 0, 0.3)',
});

const offerCardColors = ['#d7ddff', '#d8f5a3', '#fcf17e', '#fa602e'];

const buttonColors = (isDarkMode, themeColors) => ({
  btnFontPrimary: themeColors.white,
  btnFontSecondary: !isDarkMode ? themeColors.black : themeColors.white,
  btnFontLinkPrimary: !isDarkMode ? themeColors.black : themeColors.white,
  btnFontLinkSecondary: '#F98845',
  btnFontLinkPretextPrimary: '#68B2A08C',
  btnFontLinkPretextSecondary: !isDarkMode ? '#000000' : '#ffffff',
  btnPrimary: themeColors.highlightPrimary,
  btnSecondary: !isDarkMode ? themeColors.accentSoft : 'rgba(255, 255, 255, 0.1)',
});

const textInputColors = (isDarkMode, themeColors) => ({
  focussedBorder: themeColors.highlightPrimary,
  defaultBorder: themeColors.borderPrimary,
  focussedLabel: themeColors.highlightPrimary,
  defaultLabel: themeColors.fontMuted,
  error: '#B00020',
  value: !isDarkMode ? '#24272B' : '#FFFFFF',

  password: !isDarkMode ? '#222' : '#FFFFFF',
});

const brandCardColors = isDarkMode => ({
  selection: isDarkMode ? 'lightblue' : 'lightblue',
  actionBtnBg: isDarkMode
    ? 'rgba(255, 255, 255, 0.4)'
    : 'rgba(255, 255, 255, 0.4)',
});

const iconFills = isDarkMode => ({
  black: isDarkMode ? '#ffffff' : '#000000',
  red: isDarkMode ? 'red' : 'red',
  white: isDarkMode ? '#ffffff' : '#ffffff',
});

const tabBarColors = (isDarkMode, themeColors) => ({
  shadowColor: themeColors.shadowColor,
  indicatorColor: themeColors.accent,
  inactiveColor: themeColors.fontMuted,
  activeColor: themeColors.highlightPrimary,
  tabContentBg: themeColors.bgSecondary,
});

const bottomNavColors = (isDarkMode, themeColors) => ({
  activeIconColor: themeColors.highlightPrimary,
  inactiveIconColor: themeColors.fontMuted,
});

const avatarColors = isDarkMode => ({
  wrapperBg: !isDarkMode ? '#ffffff' : '#000000',
  statusIndicator: '#56C596',
  shadowColor: '#20507221',
});

const rewardsScreenColors = isDarkMode => ({
  headerFont: isDarkMode ? 'white' : '#205072',
  redeemButton: '#00AEEF',
  rewardItemBg: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : '#F8F8F8',
  rewardItemSelectedBg: isDarkMode ? '#C3DFF4' : '#F1F9FF',
  rewardItemTitle: '#00AEEF',
  rewardItemInfoText: '#777777',
  rewardIconSelectedBg: isDarkMode ? '#86B1CC' : '#B5E0FF',
});

const myProfileScreenColors = isDarkMode => ({
  borderColor: isDarkMode ? '#FAF9F6' : '#B3B3B3',
  fontColor: isDarkMode ? '#FAF9F6' : '#B3B3B3',
});

const ProgressBarColors = () => ({
  progressBG: '#F5F9F4',
  progressHighlight: '#10C299',
});

export default () => {
  const { isDarkMode } = useContext(DeviceContext);

  const themeColors = colors(isDarkMode);

  return {
    themeColors,
    buttonColors: buttonColors(isDarkMode, themeColors),
    textInputColors: textInputColors(isDarkMode, themeColors),
    brandCardColors: brandCardColors(isDarkMode, themeColors),
    iconFills: iconFills(isDarkMode, themeColors),
    tabBarColors: tabBarColors(isDarkMode, themeColors),
    bottomNavColors: bottomNavColors(isDarkMode, themeColors),
    avatarColors: avatarColors(isDarkMode),
    rewardsScreenColors: rewardsScreenColors(isDarkMode),
    ProgressBarColors: ProgressBarColors(),
    myProfileScreenColors: myProfileScreenColors(isDarkMode),
    isDarkMode,
    offerCardColors,
  };
};
