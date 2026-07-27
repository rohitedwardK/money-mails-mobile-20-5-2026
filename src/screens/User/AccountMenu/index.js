import React, {useContext} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import {useLogin} from '../../../hooks/services/useLogin';
import {UserContext} from '../../../context/UserContext';
import { styles } from './index.style';

const getInitials = userDetails => {
  const firstName = String(userDetails?.firstName || '').trim();
  const lastName = String(userDetails?.lastName || '').trim();
  const email = String(userDetails?.email || '').trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();

  return (initials || email.charAt(0) || 'U').toUpperCase();
};

const getDisplayName = userDetails => {
  const name = [userDetails?.firstName, userDetails?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return name || userDetails?.email || 'Money Mails User';
};

const menuSections = [
  {
    title: 'Your information',
    items: [
      {icon: 'user', label: 'My Account', routeName: 'profileDrawer'},
      {icon: 'star', label: 'My Rewards', routeName: 'RewardsDrawer'},
      {icon: 'calendar', label: 'My Bookings', routeName: 'CampaignTicketHistory'},
      {icon: 'ticket', label: 'Campaigns', routeName: 'Campaigns'},
      {icon: 'notification', label: 'Notifications', routeName: 'Notification'},
      {icon: 'heart', label: 'My Favourites', routeName: 'Favourites'},
    ],
  },
  {
    title: 'Help and policies',
    items: [
      {icon: 'help-with-circle', label: 'FAQ', routeName: 'FAQ'},
      {icon: 'info-with-circle', label: 'About', routeName: 'About'},
      {icon: 'text-document', label: 'Terms', routeName: 'Terms'},
      {icon: 'lock', label: 'Privacy', routeName: 'Privacy'},
      {icon: 'help', label: 'Support', routeName: 'Support'},
      {icon: 'trash', label: 'Delete Account', routeName: 'DeleteAccount'},
    ],
  },
];

const AccountMenu = ({ navigation }) => {
  const screenStyles = styles();
  const {userDetails, setUserDetails} = useContext(UserContext);
  const {setData} = useLogin();

  const navigateTo = routeName => {
    if (!routeName) {
      return;
    }

    navigation.navigate(routeName);
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('auth');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.clear();
      setData({});
      setUserDetails({});
      Snackbar.show({
        text: 'User Logged Out Successfully.',
        duration: Snackbar.LENGTH_SHORT,
      });
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.navigate('LoginScreens', {screen: 'SignIn'});
      } else {
        navigation.navigate('LoginScreens', {screen: 'SignIn'});
      }
    } catch (exception) {
      return false;
    }
  };

  const logoutHandlerAlert = () => {
    Alert.alert('Alert', 'Are you sure wants to Logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: logoutHandler},
    ]);
  };

  return (
    <SafeAreaView style={screenStyles.root}>
      <LinearGradient
        colors={['#E9F8EA', '#F7FAF8', '#F7FAF8']}
        locations={[0, 0.42, 1]}
        style={screenStyles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={screenStyles.content}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={screenStyles.backButton}
            onPress={() => navigation.goBack()}>
            <EntypoIcon name="chevron-left" size={24} color="#1F4D2B" />
          </TouchableOpacity>

          <View style={screenStyles.profileBlock}>
            <View style={screenStyles.avatar}>
              <Text style={screenStyles.avatarText}>{getInitials(userDetails)}</Text>
            </View>
            <Text style={screenStyles.name}>{getDisplayName(userDetails)}</Text>
            {!!userDetails?.email && (
              <Text style={screenStyles.userId} numberOfLines={1}>
                {userDetails.email}
              </Text>
            )}
          </View>

          {menuSections.map(section => (
            <View key={section.title} style={screenStyles.section}>
              <Text style={screenStyles.sectionTitle}>{section.title}</Text>
              {section.items.map(item => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={item.label}
                  style={screenStyles.menuRow}
                  onPress={() => navigateTo(item.routeName)}>
                  <View style={screenStyles.menuRowLeft}>
                    <EntypoIcon name={item.icon} size={18} color="#2F9D8F" />
                    <Text style={screenStyles.menuText}>{item.label}</Text>
                  </View>
                  <EntypoIcon name="chevron-small-right" size={22} color="#8FA39A" />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.82}
            style={[screenStyles.menuRow, screenStyles.logoutRow]}
            onPress={logoutHandlerAlert}>
            <View style={screenStyles.menuRowLeft}>
              <EntypoIcon name="log-out" size={18} color="#FFB4A8" />
              <Text style={[screenStyles.menuText, screenStyles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AccountMenu;
