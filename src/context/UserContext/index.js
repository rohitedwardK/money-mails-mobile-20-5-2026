import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {buildUserSession} from '../../utils/authSession';
import {
  mergeSensitiveIntoUser,
  migrateFromAsyncStorage,
} from '../../utils/secureStorage';

export const UserContext = createContext();

const parseJson = value => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
};

const UserContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
    phone: {
      code: '91',
      value: '',
    },
    primaryEmail: '',
    address: {
      location: '',
      city: '',
      addressLine1: '',
      state: '',
      county: '',
      country: '',
      apartmentNo: '',
      zip: '',
      zelle_id : '',
      landmark: '',
    },
    demographics: {
      race: '',
      dob: '',
    },
    isAuthenticated: false,
  });

  const [activeBrand, setActiveBrand] = useState([]);
  const [activeCategory, setActiveCategory] = useState([]);
  const [location, setLocation] = useState({});
  const [isUserSessionLoading, setIsUserSessionLoading] = useState(true);
  const [postAuthScreen, setPostAuthScreen] = useState(null);
  const [pendingGuestRoute, setPendingGuestRoute] = useState(null);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const migratedUser = await migrateFromAsyncStorage();
        const rawUser = migratedUser || parseJson(await AsyncStorage.getItem('user'));
        if (rawUser?.uuid || rawUser?.user_uuid) {
          const hydratedUser = await mergeSensitiveIntoUser(rawUser);
          setUserDetails(buildUserSession(hydratedUser));
        }
      } catch (_error) {
        await AsyncStorage.removeItem('user');
      } finally {
        setIsUserSessionLoading(false);
      }
    };

    onLoad();
  }, []);

  const value = {
    userDetails,
    setUserDetails,
    activeBrand,
    setActiveBrand,
    activeCategory,
    setActiveCategory,
    setLocation,
    location,
    isUserSessionLoading,
    postAuthScreen,
    setPostAuthScreen,
    pendingGuestRoute,
    setPendingGuestRoute,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
