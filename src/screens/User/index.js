import React from 'react';
import {Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
  {label: 'Mails', routeName: 'Mails', icon: 'mail-outline'},
  {label: 'Saved', routeName: 'Favourites', icon: 'heart-outline'},
  {label: 'Campaigns', routeName: 'Campaigns', icon: 'megaphone-outline'},
  {label: 'More', routeName: 'AccountMenu', icon: 'grid-outline'},
];

const FooterNav = ({navigation, activeRouteName}) => {
  const {themeColors} = getColors();
  const styles = userScreenStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footerNav, {paddingBottom: Math.max(insets.bottom, 8)}]}>
      {footerItems.map(item => {
        const isActive = activeRouteName === item.routeName;

        return (
          <TouchableOpacity
            key={item.routeName}
            activeOpacity={0.82}
            style={styles.footerNavItem}
            onPress={() => navigation.navigate(item.routeName)}>
            <View
              style={[
                styles.footerIconWrap,
                isActive ? styles.footerIconWrapActive : null,
              ]}>
              <Ionicons
                name={item.icon}
                size={21}
                color={isActive ? themeColors.highlightPrimary : themeColors.fontMuted}
              />
            </View>
            <Text
              style={[
                styles.footerNavLabel,
                isActive ? styles.footerNavLabelActive : null,
              ]}
              numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ScreenWithFooter = ({component: Component, ...props}) => {
  const styles = userScreenStyles();

  return (
    <View style={styles.screenWithFooter}>
      <View style={styles.screenContentWithFooter}>
        <Component {...props} />
      </View>
      <FooterNav
        navigation={props.navigation}
        activeRouteName={props.route?.name || 'Home'}
      />
    </View>
  );
};

const HomeWithFooter = props => <ScreenWithFooter component={Home} {...props} />;
const MailsWithFooter = props => <ScreenWithFooter component={Mails} {...props} />;
const FavouritesWithFooter = props => <ScreenWithFooter component={Favourites} {...props} />;
const BookingsWithFooter = props => <ScreenWithFooter component={CampaignTicketHistory} {...props} />;
const OffersWithFooter = props => <ScreenWithFooter component={Rewards} {...props} />;
const ProfileWithFooter = props => <ScreenWithFooter component={Profile} {...props} />;
const CampaignsWithFooter = props => <ScreenWithFooter component={Campaigns} {...props} />;
const MoreWithFooter = props => <ScreenWithFooter component={AccountMenu} {...props} />;

const UserScreens = ({route}) => {
  const {themeColors} = getColors();
  const styles = userScreenStyles();
  const nestedScreen = route?.params?.screen;
  const nestedParams = route?.params?.params;
  const initialRouteName = nestedScreen || 'Home';
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
      initialRouteName={initialRouteName}
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
      <Stack.Screen name="Mails" component={MailsWithFooter} />
      <Stack.Screen name="MoreMails" component={MailsWithFooter} options={internalHeader('More Mails')} />
      <Stack.Screen name="Rewards" component={OffersWithFooter} options={internalHeader('Rewards')} />
      <Stack.Screen name="RewardsDrawer" component={Rewards} options={internalHeader('Rewards')} />
      <Stack.Screen name="Favourites" component={FavouritesWithFooter} />
      <Stack.Screen name="Profile" component={ProfileWithFooter} options={internalHeader('Profile')} />
      <Stack.Screen name="profileDrawer" component={Profile} options={internalHeader('Profile')} />
      <Stack.Screen name="AccountMenu" component={MoreWithFooter} />
      <Stack.Screen name="Bingo" component={Bingo} options={internalHeader('Bingo')} />
      <Stack.Screen name="Notification" component={Notification} options={internalHeader('Notifications')} />
      <Stack.Screen name="PointRedeemHistory" component={PointRedeemHistory} options={internalHeader('Redeem History')} />
      <Stack.Screen name="Campaigns" component={CampaignsWithFooter} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetail} />
      <Stack.Screen name="CampaignTicketHistory" component={BookingsWithFooter} options={internalHeader('Ticket History')} />
      <Stack.Screen
        name="CompleteInfo"
        component={CompleteInfo}
        options={internalHeader('Complete Profile')}
        initialParams={nestedScreen === 'CompleteInfo' ? nestedParams : undefined}
      />
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
