import React, {useEffect, useRef} from 'react';
import {Animated, Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Category from './Category';
import Store from './Stores';
import Mails from './Mails';
import Rewards from './Rewards';
import Favourites from './Favourites';
import Profile from './Profile';
import AccountMenu from './AccountMenu';
import Bingo from './Bingo';
import Notification from './Notifications';
import PointRedeemHistory from './PointRedeemHistory';
import Campaigns from './Campaigns';
import CampaignDetail from './Campaigns/CampaignDetail';
import CampaignTicketHistory from './Campaigns/TicketHistory';
import CompleteInfo from './profileComplete/completeInfo';
import ProfileSetting from './profileComplete/ProfileSetting';
import AddressDetails from './profileComplete/AddressDetails';
import PersonalizationDetails from './profileComplete/PersonalizationDetails';
import VerificationInformation from './profileComplete/VerificationInformation';
import {
  AboutScreen,
  DeleteAccountScreen,
  FAQScreen,
  PopupAdsScreen,
  PrivacyScreen,
  SupportScreen,
  TermsScreen,
} from './StaticPages';
import getColors from '../../utils/colors';
import appBackground from '../../assets/images/appBackground.png';
import {styles as userScreenStyles} from './index.style';

const Stack = createNativeStackNavigator();

const footerItems = [
  {label: 'Home', routeName: 'Home', icon: 'home'},
  {label: 'Bookings', routeName: 'CampaignTicketHistory', icon: 'calendar-outline'},
  {label: 'Campaign', routeName: 'Campaigns', icon: 'megaphone-outline'},
];

const FooterNav = ({navigation, activeRouteName, animatedStyle, onInteraction}) => {
  const {themeColors} = getColors();
  const styles = userScreenStyles();

  return (
    <Animated.View style={[styles.footerNav, animatedStyle]}>
      {footerItems.map(item => {
        const isActive = activeRouteName === item.routeName;

        return (
          <TouchableOpacity
            key={item.routeName}
            activeOpacity={0.82}
            style={styles.footerNavItem}
            onPress={() => {
              onInteraction();
              navigation.navigate(item.routeName);
            }}>
            <View
              style={[
                styles.footerIconWrap,
                isActive ? styles.footerIconWrapActive : null,
              ]}>
              <Ionicons
                name={item.icon}
                size={19}
                color={isActive ? themeColors.highlightPrimary : themeColors.fontMuted}
              />
            </View>
            <Text
              style={[
                styles.footerNavLabel,
                isActive ? styles.footerNavLabelActive : null,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const ScreenWithFooter = ({component: Component, ...props}) => {
  const styles = userScreenStyles();
  const footerTranslateY = useRef(new Animated.Value(90)).current;
  const hideFooterTimer = useRef(null);

  const hideFooter = () => {
    Animated.timing(footerTranslateY, {
      toValue: 90,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const showFooter = () => {
    if (hideFooterTimer.current) {
      clearTimeout(hideFooterTimer.current);
    }

    Animated.timing(footerTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();

    hideFooterTimer.current = setTimeout(hideFooter, 1500);
  };

  useEffect(() => () => {
    if (hideFooterTimer.current) {
      clearTimeout(hideFooterTimer.current);
    }
  }, []);

  return (
    <View
      style={styles.screenWithFooter}
      onTouchStart={showFooter}
      onMoveShouldSetResponderCapture={() => {
        showFooter();
        return false;
      }}>
      <View style={styles.screenContentWithFooter}>
        <Component {...props} />
      </View>
      <FooterNav
        navigation={props.navigation}
        activeRouteName={props.route?.name || 'Home'}
        animatedStyle={{transform: [{translateY: footerTranslateY}]}}
        onInteraction={showFooter}
      />
    </View>
  );
};

const HomeWithFooter = props => <ScreenWithFooter component={Home} {...props} />;
const BookingsWithFooter = props => <ScreenWithFooter component={CampaignTicketHistory} {...props} />;
const OffersWithFooter = props => <ScreenWithFooter component={Rewards} {...props} />;
const ProfileWithFooter = props => <ScreenWithFooter component={Profile} {...props} />;
const CampaignsWithFooter = props => <ScreenWithFooter component={Campaigns} {...props} />;
const MoreWithFooter = props => <ScreenWithFooter component={AccountMenu} {...props} />;

const UserScreens = () => {
  const {themeColors} = getColors();
  const styles = userScreenStyles();
  const internalHeader = title => ({
    headerShown: true,
    title,
    headerBackTitleVisible: false,
    headerTintColor: themeColors.fontPrimary,
    headerStyle: {
      backgroundColor: themeColors.homeBackground || themeColors.bgPrimary,
    },
    headerTitleStyle: {
      color: themeColors.fontPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: 'transparent',
    },
  });

  return (
  <View style={styles.appBackground}>
    <View pointerEvents="none" style={styles.appBackgroundFill} />
    <View pointerEvents="none" style={styles.appBackgroundImageBand}>
      <Image
        source={appBackground}
        resizeMode="cover"
        style={styles.appBackgroundImage}
      />
    </View>
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <StatusBar
      backgroundColor={themeColors.homeBackground || themeColors.bgPrimary}
      barStyle="dark-content"
      translucent={false}
    />
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Stack.Screen name="Home" component={HomeWithFooter} />
      <Stack.Screen name="Category" component={Category} options={internalHeader('Category')} />
      <Stack.Screen name="Store" component={Store} options={internalHeader('Stores')} />
      <Stack.Screen name="MoreBrands" component={Store} options={internalHeader('More Brands')} />
      <Stack.Screen name="Mails" component={Mails} options={internalHeader('Mails')} />
      <Stack.Screen name="MoreMails" component={Mails} options={internalHeader('More Mails')} />
      <Stack.Screen name="Rewards" component={OffersWithFooter} options={internalHeader('Rewards')} />
      <Stack.Screen name="RewardsDrawer" component={Rewards} options={internalHeader('Rewards')} />
      <Stack.Screen name="Favourites" component={Favourites} options={internalHeader('Favourites')} />
      <Stack.Screen name="Profile" component={ProfileWithFooter} options={internalHeader('Profile')} />
      <Stack.Screen name="profileDrawer" component={Profile} options={internalHeader('Profile')} />
      <Stack.Screen name="AccountMenu" component={MoreWithFooter} />
      <Stack.Screen name="Bingo" component={Bingo} options={internalHeader('Bingo')} />
      <Stack.Screen name="Notification" component={Notification} options={internalHeader('Notifications')} />
      <Stack.Screen name="PointRedeemHistory" component={PointRedeemHistory} options={internalHeader('Redeem History')} />
      <Stack.Screen name="Campaigns" component={CampaignsWithFooter} options={internalHeader('Campaigns')} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetail} options={internalHeader('Campaign Detail')} />
      <Stack.Screen name="CampaignTicketHistory" component={BookingsWithFooter} options={internalHeader('Ticket History')} />
      <Stack.Screen name="CompleteInfo" component={CompleteInfo} options={internalHeader('Complete Profile')} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={internalHeader('Profile Settings')} />
      <Stack.Screen name="AddressDetails" component={AddressDetails} options={internalHeader('Address Details')} />
      <Stack.Screen
        name="PersonalizationDetails"
        component={PersonalizationDetails}
        options={internalHeader('Personalization')}
      />
      <Stack.Screen
        name="VerificationInformation"
        component={VerificationInformation}
        options={internalHeader('Verification')}
      />
      <Stack.Screen name="Terms" component={TermsScreen} options={internalHeader('Terms')} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={internalHeader('Privacy')} />
      <Stack.Screen name="About" component={AboutScreen} options={internalHeader('About')} />
      <Stack.Screen name="FAQ" component={FAQScreen} options={internalHeader('FAQ')} />
      <Stack.Screen name="Support" component={SupportScreen} options={internalHeader('Support')} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={internalHeader('Delete Account')} />
      <Stack.Screen name="PopupAds" component={PopupAdsScreen} options={internalHeader('Ads')} />
    </Stack.Navigator>
  </SafeAreaView>
  </View>
  );
};

export default UserScreens;
