import { useContext } from 'react';
import { DeviceContext } from '../context/DeviceContext';

const colors = isDarkMode => ({
  accent: '#4EA838',
  white: !isDarkMode ? '#ffffff' : '#FAF9F6',
  black: '#2F4A30',
  highlightPrimary: '#4EA838',
  bgPrimary: !isDarkMode ? '#F4F9EF' : '#28302e',
  fontPrimary: !isDarkMode ? '#304B2F' : '#ffffff',
  fontPrimaryInvert: isDarkMode ? '#000000' : '#ffffff',
  cardsPlaceholder: !isDarkMode ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
  statusbarUserPrimaryColor: !isDarkMode ? '#50AB32' : '#50AB32',
  borderPrimary: !isDarkMode ? '#D8E8CC' : '#FAF9F6',
  transparentDrawer: 'rgba(0, 0, 0, 0.3)',
  fontFamily: 'System',
});

const offerCardColors = ['#d7ddff', '#d8f5a3', '#fcf17e', '#f58d6b'];

const buttonColors = (isDarkMode, themeColors) => ({
  btnFontPrimary: themeColors.white,
  btnFontSecondary: !isDarkMode ? themeColors.black : themeColors.white,
  btnFontLinkPrimary: !isDarkMode ? themeColors.black : themeColors.white,
  btnFontLinkSecondary: '#3F8F2F',
  btnFontLinkPretextPrimary: '#557257',
  btnFontLinkPretextSecondary: !isDarkMode ? '#000000' : '#ffffff',
  btnPrimary: themeColors.highlightPrimary,
  btnSecondary: !isDarkMode ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
});

const textInputColors = (isDarkMode, themeColors) => ({
  focussedBorder: themeColors.highlightPrimary,
  defaultBorder: '#D3DFEF',
  focussedLabel: '#466346',
  defaultLabel: '#607860',
  error: '#B00020',
  value: !isDarkMode ? '#304B2F' : '#222',

  password: '#222',
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
  shadowColor: isDarkMode ? '#6B6B6B21' : '#6B6B6B21',
  indicatorColor: isDarkMode ? '#4EA838' : '#4EA838',
  inactiveColor: isDarkMode ? themeColors.white : themeColors.black,
  activeColor: isDarkMode ? '#4EA838' : '#4EA838',
  tabContentBg: isDarkMode ? themeColors.bgPrimary : '#F3F8EE',
});

const bottomNavColors = (isDarkMode, themeColors) => ({
  activeIconColor: isDarkMode ? '#6B6B6B21' : '#6B6B6B21',
  inactiveIconColor: isDarkMode ? '#4EA838' : '#4EA838',
});

const avatarColors = isDarkMode => ({
  wrapperBg: !isDarkMode ? '#ffffff' : '#000000',
  statusIndicator: '#56C596',
  shadowColor: '#20507221',
});

const rewardsScreenColors = isDarkMode => ({
  headerFont: isDarkMode ? 'white' : '#205072',
  redeemButton: '#4EA838',
  rewardItemBg: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : '#F8F8F8',
  rewardItemSelectedBg: isDarkMode ? '#C3DFF4' : '#E0EFD1',
  rewardItemTitle: '#4EA838',
  rewardItemInfoText: '#777777',
  rewardIconSelectedBg: isDarkMode ? '#86B1CC' : '#D8E8CC',
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
    avatarColors: avatarColors(isDarkMode),
    rewardsScreenColors: rewardsScreenColors(isDarkMode),
    ProgressBarColors: ProgressBarColors(),
    myProfileScreenColors: myProfileScreenColors(isDarkMode),
    isDarkMode,
    offerCardColors
  };
};
