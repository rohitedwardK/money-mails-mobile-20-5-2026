import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {buildUserSession} from '../../utils/authSession';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
    phone: {
      code: "91",
      value: "",
    },
    primaryEmail: "",
    address: {
      location: "",
      city: "",
      addressLine1: "",
      state: "",
      county: "",
      country: "",
      apartmentNo: "",
      zip: "",
      zelle_id : "",
      landmark: "",
    },
    demographics: {
      race: "",
      dob: "",
    },
    isAuthenticated: false,
  });

  const [activeBrand, setActiveBrand] = useState([]);
  const [activeCategory, setActiveCategory] = useState([]);
  const [location, setLocation] = useState({});
  const [isUserSessionLoading, setIsUserSessionLoading] = useState(true);

  useEffect(() => {
    const onLoad = async () => {
      try {
        const rawUser = await AsyncStorage.getItem('user');
        const parsedUser = rawUser ? JSON.parse(rawUser) : null;
        if (parsedUser?.uuid || parsedUser?.user_uuid || parsedUser?.token) {
          setUserDetails(buildUserSession(parsedUser));
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
