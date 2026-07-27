import React, { useContext } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { DeviceContext } from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';
import { appBarStyles } from './index.style';
import { UserContext } from '../../../context/UserContext';
import StoriesScreen from '../../../screens/User/Home/stories';
import BrandLogo from '../../../assets/images/brandLogo.js';
import appBackground from '../../../assets/images/appBackground.png';

const getInitials = userDetails => {
  const firstName = String(userDetails?.firstName || '').trim();
  const lastName = String(userDetails?.lastName || '').trim();
  const email = String(userDetails?.email || '').trim();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return (initials || email.charAt(0) || 'U').toUpperCase();
};

const AppHeader = ({
  locationTitle = 'City',
  locationSubtitle = '',
  onLocationPress,
  onProfilePress,
}) => {
  const { userDetails } = useContext(UserContext);
  const { isAndroid } = useContext(DeviceContext);
  const navigation = useNavigation();
  const {
    container,
    locationButton,
    locationTitleRow,
    locationTitleText,
    locationSubtitleText,
    headerActions,
    initialsButton,
    initialsText,
    logoContainer,
    bingoButton,
    notificationButton,
    headerBackgroundImage,
  } = appBarStyles({ isAndroid });
  const { themeColors: colors } = getColors();
  const headerIconColor = colors.fontPrimary;

  return (
    // <ImageBackground
    //   source={appBackground}
    //   resizeMode="cover"
    //   style={container}
    //   imageStyle={headerBackgroundImage}>
      
    // </ImageBackground>
    <View style={container}>
      <View style={locationButton}>
        <TouchableOpacity
          style={logoContainer}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}>
          <BrandLogo width={126} height={30} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={!onLocationPress}
          onPress={onLocationPress}
          style={locationTitleRow}
          accessibilityRole="button"
          accessibilityLabel="Change city">
          <EntypoIcon name="location-pin" size={14} color={headerIconColor} />
          <Text style={locationTitleText} numberOfLines={1}>
            {locationTitle || 'City'}
          </Text>
          {!!onLocationPress && (
            <EntypoIcon name="chevron-down" size={14} color={headerIconColor} />
          )}
        </TouchableOpacity>
        {!!locationSubtitle && (
          <Text style={locationSubtitleText} numberOfLines={1}>
            {locationSubtitle}
          </Text>
        )}
      </View>

      <View style={headerActions}>
        {userDetails?.uuid && userDetails?.token &&
          <StoriesScreen userId={userDetails?.uuid} userToken={userDetails?.token} />
        }

        <TouchableOpacity
          style={bingoButton}
          onPress={() => navigation.navigate('Bingo')}>
          <EntypoIcon name="game-controller" size={24} color={'#D92D20'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={notificationButton}
          onPress={() => navigation.navigate('Notification')}>
          <EvilIcon name="bell" size={32} color={headerIconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={initialsButton}
          onPress={onProfilePress}>
          <Text style={initialsText}>{getInitials(userDetails)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppHeader;
