import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const onLoad = async() => {
    if(userDetails?.firstName === '') {
        setUserDetails(JSON.parse(await AsyncStorage.getItem('user')));
      }
  };

  useEffect(()=> {
    onLoad();
  },[userDetails])

  const value = {
    userDetails,
    setUserDetails,
    activeBrand,
    setActiveBrand,
    activeCategory,
    setActiveCategory,
    setLocation,
    location
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
