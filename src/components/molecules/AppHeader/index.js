import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import BrandLogo from '../../../assets/images/brandLogo.js';

const GREEN = '#1F8A4C';
const MUTED = '#6B7280';
const TEXT = '#111827';

const getInitials = userDetails => {
  const firstName = String(userDetails?.firstName || '').trim();
  const lastName = String(userDetails?.lastName || '').trim();
  const email = String(userDetails?.email || '').trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return (initials || email.charAt(0) || 'U').toUpperCase();
};

const getGreetingName = userDetails => {
  const firstName = String(userDetails?.firstName || '').trim();
  if (firstName) {
    return firstName;
  }
  const email = String(userDetails?.email || '').trim();
  return email.split('@')[0] || 'there';
};

const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

const AppHeader = ({
  locationTitle = 'City',
  onLocationPress,
  onProfilePress,
  userDetails,
}) => {
  const navigation = useNavigation();
  const details = userDetails || {};

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting} numberOfLines={1}>
          {`${getTimeOfDayGreeting()}, ${getGreetingName(details)}`}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
          style={styles.logoButton}
          accessibilityLabel="Money Mails home">
          <BrandLogo width={168} height={35} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={!onLocationPress}
          onPress={onLocationPress}
          style={styles.locationPill}
          accessibilityRole="button"
          accessibilityLabel="Change city">
          <EntypoIcon name="location-pin" size={14} color={GREEN} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationTitle || 'City'}
          </Text>
          {!!onLocationPress && (
            <EntypoIcon name="chevron-small-down" size={18} color={TEXT} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Bingo')}
          accessibilityLabel="Bingo">
          <Ionicons name="game-controller-outline" size={22} color="#E53935" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notification')}
          accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color={TEXT} />
          <View style={styles.dot} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.avatar}
          onPress={onProfilePress}
          accessibilityLabel="Profile">
          <Text style={styles.avatarText}>{getInitials(details)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F6F7F4',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 4,
  },
  logoButton: {
    width: 168,
    height: 35,
    marginBottom: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingLeft: 10,
    paddingRight: 6,
    minHeight: 30,
  },
  locationText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 2,
    maxWidth: 160,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AppHeader;
