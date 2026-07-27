import React, { useState, useEffect, useContext, useCallback, useLayoutEffect, useRef, useMemo } from 'react';
import { Image, ActivityIndicator, ScrollView, Text, View, TouchableOpacity, StyleSheet, FlatList, Button, Dimensions, Switch, Modal, ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import OffersCarousal from './OffersCarousal';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import AppHeader from '../../../components/molecules/AppHeader';
import { styles as homeScreenStyles } from './index.style';
import TabView from '../../../components/organisms/TabView';
import DoYouKnowSection from './DoYouKnowSection';
import { useInterval } from '../../../hooks/useInterval';
import OfferCard from '../../../components/organisms/OfferCard';
import { ModalContext } from '../../../context/ModalContext';
import RedeemModalContent from './RedeemModalContent';
import { useHome } from "../../../hooks/services/useHome";
import { useBrand } from "../../../hooks/services/useBrand";
import { useCategory } from "../../../hooks/services/useCategory";
import { useSubCategory } from "../../../hooks/services/useSubCategory";
import { useMail } from "../../../hooks/services/useMail";
import { useCountry } from "../../../hooks/services/useCountry";
import { useStates } from "../../../hooks/services/useStates";
import { useCounty } from "../../../hooks/services/useCounty";
import { useCity } from "../../../hooks/services/useCity";
import { UserContext } from "../../../context/UserContext";
import { DeviceContext } from '../../../context/DeviceContext';
import { useStateData } from "../../../hooks/services/useStateData";
import { useCountyData } from "../../../hooks/services/useCountyData";
import { useCityData } from "../../../hooks/services/useCityData";
import { useAllCities } from "../../../hooks/services/useAllCities";
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { usePopUpAds } from '../../../hooks/services/usePopupads';
import getColors from '../../../utils/colors';
import { useRoute } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import YouTubePlayer from '../Youtube';
import Pdf from 'react-native-pdf';

import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import { baseUrl } from '../../../connections';
import StoriesScreen from './stories';
import Carousel from 'react-native-reanimated-carousel';

import FastImage from 'react-native-fast-image';
import { useQuery } from '@tanstack/react-query';
import { fetchStoreProfile } from '../../../api/moneyMails';
import { useHomeQueries } from '../../../hooks/useHomeQueries';
import CampaignsPanel from '../Campaigns/CampaignsPanel';

const arr = new Array(15).fill('');
const brandsArr = new Array(6).fill('');

const categoryDoodleItems = [
  { name: 'mail', size: 24, top: 8, left: 14, rotate: '-12deg' },
  { name: 'price-tag', size: 18, top: 42, left: 72, rotate: '14deg' },
  { name: 'star', size: 20, top: 18, left: 138, rotate: '18deg' },
  { name: 'shopping-cart', size: 22, top: 44, left: 214, rotate: '-10deg' },
  { name: 'credit-card', size: 24, top: 9, left: 286, rotate: '12deg' },
  { name: 'mail', size: 23, top: 43, right: 86, rotate: '-14deg' },
  { name: 'price-tag', size: 20, top: 13, right: 28, rotate: '18deg' },
];
const DO_YOU_KNOW_TAB_UUID = '__do_you_know__';

const getProfileLocationValue = value => {
  if (value && typeof value === 'object') {
    return value.uuid || value.value || value._id || value.id || '';
  }

  return value || '';
};

const getProfileLocationLabel = value => {
  if (value && typeof value === 'object') {
    return value.name || value.label || value.title || '';
  }

  return '';
};

const getReadableLocationValue = value => {
  const text = String(value || '').trim();
  return /^[A-Z]{2}-[A-Z0-9]+$/i.test(text) ? '' : text;
};

const getLocationItemLabel = (items, selectedValue) => {
  if (!Array.isArray(items) || !items.length) {
    return '';
  }

  const selectedText = String(selectedValue || '');
  const matchedItem = items.find(item => {
    const itemIds = [item?.uuid, item?.value, item?._id, item?.id]
      .filter(Boolean)
      .map(String);

    return itemIds.includes(selectedText);
  });

  return getProfileLocationLabel(matchedItem || (items.length === 1 ? items[0] : null));
};

const getLocationItemValue = (items, selectedValue) => {
  if (!Array.isArray(items) || !items.length) {
    return '';
  }

  const selectedText = String(selectedValue || '').trim().toLowerCase();
  const matchedItem = items.find(item => {
    const itemIds = [item?.uuid, item?.value, item?._id, item?.id]
      .filter(Boolean)
      .map(value => String(value).trim().toLowerCase());
    const itemLabels = [item?.name, item?.label, item?.title]
      .filter(Boolean)
      .map(value => String(value).trim().toLowerCase());

    return itemIds.includes(selectedText) || itemLabels.includes(selectedText);
  });

  return matchedItem
    ? getProfileLocationValue(matchedItem)
    : '';
};

const getProfileLocationUuid = (profile, field, rawValue) => {
  const directValue = getProfileLocationValue(rawValue);
  if (/^[A-Z]{2,5}-[A-Z0-9]+$/i.test(String(directValue || '').trim())) {
    return directValue;
  }

  const lookupKeys = {
    country: 'countries',
    state: 'states',
    county: 'counties',
    city: 'cities',
  };

  return getLocationItemValue(profile?.[lookupKeys[field]], directValue) || directValue;
};

const getProfileLocationRawValue = (profile = {}, field) => {
  const address = profile?.address || {};
  const pascalField = `${field}Name`;
  const snakeField = `${field}_name`;
  const uuidField = `${field}_uuid`;

  return (
    address?.[uuidField] ||
    profile?.[uuidField] ||
    address?.[field] ||
    profile?.[field] ||
    address?.[pascalField] ||
    profile?.[pascalField] ||
    address?.[snakeField] ||
    profile?.[snakeField] ||
    ''
  );
};

const getBrandQueryValue = value => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(',');
  }

  return value || '';
};

const getCategoryUuid = category =>
  typeof category === 'string'
    ? category
    : category?.uuid || category?.value || category?.id || '';

const Home = ({ navigation }) => {
  const route = useRoute();
  const [actBrand, setActBrand] = useState("");
  const { themeColors } = getColors();
  const [seconds, setSeconds] = useState(0);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState();
  const [redeemedOfferIndexes, setRedeemedOfferIndexes] = useState([]);
  const [isOfferClicked, setIsOfferClicked] = useState(false);
  const { userDetails, location, activeBrand, setActiveCategory, activeCategory, setActiveBrand } = useContext(UserContext);
  const { screenWidth, screenHeight } = useContext(DeviceContext);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerContentRoute, setDrawerContentRoute] = useState("search");
  const offerDetailsCardRef = (null);
  const { data, isLoading, error, setPayload } = useHome();
  const { isBrandLoading: legacyBrandLoading, brandError, setBrandPayload, setUpdateBrandFav } = useBrand();
  const { isCatLoading, catError, setCatPayload, setData } = useCategory();
  const { setSubCatPayload, setSubCatBrand } = useSubCategory();
  const { setPopUpAds, PopUpAddData } = usePopUpAds();

  const { isMailLoading: legacyMailLoading, mailCount: legacyMailCount, isRedeem, redeemMessage, redeemSuccessMessage, redeemError, mailHTML, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL } = useMail();
  const [subCatActive, setSubCatActive] = useState();
  const { countryList, setCountry } = useCountry();
  const { countyList, setCounty } = useCounty();
  const { cityList, setCity } = useCity();
  const { stateList, setStates } = useStates();
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();
  const {cityList: allCities, isLoading: isAllCitiesLoading} = useAllCities();
  const [selCountry, setSelCountry] = useState();
  const [selState, setSelState] = useState();
  const [selCounty, setSelCounty] = useState();
  const [selCity, setSelCity] = useState();
  const [offerCard, setOfferCard] = useState({});
  const [selCategory, setSelCategory] = useState('');
  const [selBrand, setSelBrand] = useState([]);
  const [isAnimate, setIsAnimate] = useState(true);
  const [tabIndexs, setTabindexs] = useState(0);
  const [timerShow, setTimerShow] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cityName, setcityname] = useState('');
  const [changeCity, setChangeCity] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCityPickerVisible, setIsCityPickerVisible] = useState(false);
  const [isCityTransitioning, setIsCityTransitioning] = useState(false);
  const [seen, setSeen] = useState(false)
  const [profileCityLabel, setProfileCityLabel] = useState('');
  const previousSelectedStoreUuidRef = useRef('');
  const homeCityUuid = getProfileLocationUuid(
    userDetails,
    'city',
    getProfileLocationRawValue(userDetails, 'city'),
  );
  const cityNameCounts = useMemo(
    () =>
      allCities.reduce((counts, city) => {
        counts[city?.name] = (counts[city?.name] || 0) + 1;
        return counts;
      }, {}),
    [allCities],
  );
  const getCityPickerLabel = useCallback(
    city => {
      if ((cityNameCounts[city?.name] || 0) <= 1) return city?.name;
      const county = city?.counties?.[0]?.name;
      const state = city?.states?.[0]?.name;
      const suffix = [county, state].filter(Boolean).join(', ');
      return suffix ? `${city?.name} (${suffix})` : city?.name;
    },
    [cityNameCounts],
  );
  const sortedCities = useMemo(() => {
    const home = allCities.filter(city => city?.uuid === homeCityUuid);
    const rest = allCities
      .filter(city => city?.uuid !== homeCityUuid)
      .slice()
      .sort((a, b) =>
        getCityPickerLabel(a).localeCompare(getCityPickerLabel(b), undefined, {
          sensitivity: 'base',
        }),
      );
    return [...home, ...rest];
  }, [allCities, getCityPickerLabel, homeCityUuid]);

  const hasLocationFilters = Boolean(userDetails?.uuid && selCountry && selCity);
  const selectedCategoryUuid = getCategoryUuid(selCategory);
  const hasCategoryFilters = Boolean(hasLocationFilters && selectedCategoryUuid);
  const {
    categoryList = [],
    isCategoryLoading,
    barndList = [],
    isBrandLoading,
    subCategoryList = [],
    isSubCategoryLoading,
    mailList = [],
    isMailLoading,
    mailCount,
  } = useHomeQueries({
    selCity,
    selState,
    selCountry,
    selCounty,
    selCategory: selectedCategoryUuid,
    selBrand,
    subCatActive,
    seen,
    userDetails,
  });

  useEffect(() => {
    if (!isCityTransitioning) return undefined;
    if (
      isCategoryLoading ||
      isBrandLoading ||
      isSubCategoryLoading ||
      isMailLoading
    ) {
      return undefined;
    }
    const transitionTimer = setTimeout(() => {
      setIsCityTransitioning(false);
    }, 250);
    return () => clearTimeout(transitionTimer);
  }, [
    isBrandLoading,
    isCategoryLoading,
    isCityTransitioning,
    isMailLoading,
    isSubCategoryLoading,
    selCity,
  ]);


  useEffect(() => {
    const matchedCity = cityData?.find(city => city?.uuid === selCity || city?.value === selCity);
    setcityname(profileCityLabel || matchedCity?.name || matchedCity?.label || getReadableLocationValue(selCity));
  }, [cityData, profileCityLabel, selCity])

  useEffect(() => {
    const normalizedState = getLocationItemValue(stateData, selState);
    if (normalizedState && normalizedState !== selState) {
      setSelState(normalizedState);
      setCountyData(normalizedState);
    }
  }, [selState, setCountyData, stateData]);

  useEffect(() => {
    const normalizedCounty = getLocationItemValue(countyData, selCounty);
    if (normalizedCounty && normalizedCounty !== selCounty) {
      setSelCounty(normalizedCounty);
      setCityData(normalizedCounty);
    }
  }, [countyData, selCounty, setCityData]);

  useEffect(() => {
    const normalizedCity = getLocationItemValue(cityData, selCity);
    if (normalizedCity && normalizedCity !== selCity) {
      setSelCity(normalizedCity);
    }
  }, [cityData, selCity]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectCity = city => {
    setIsCityTransitioning(true);
    setSelCountry(city?.countries?.[0]?.uuid);
    setSelState(city?.states?.[0]?.uuid);
    setSelCounty(city?.county_uuid || city?.counties?.[0]?.uuid);
    setSelCity(city?.uuid);
    setSelectedCity(city);
    setProfileCityLabel(city?.name || '');
    setChangeCity(true);
    setActBrand('');
    setSelBrand([]);
    setActiveBrand([]);
    setSubCatActive(DO_YOU_KNOW_TAB_UUID);
    setIsCityPickerVisible(false);
  };

  const syncProfileLocation = (profile = {}) => {
    const address = profile?.address || {};
    const country = getProfileLocationUuid(profile, 'country', getProfileLocationRawValue(profile, 'country'));
    const state = getProfileLocationUuid(profile, 'state', getProfileLocationRawValue(profile, 'state'));
    const county = getProfileLocationUuid(profile, 'county', getProfileLocationRawValue(profile, 'county'));
    const cityRaw = getProfileLocationRawValue(profile, 'city');
    const city = getProfileLocationUuid(profile, 'city', cityRaw);
    const cityLabel =
      getProfileLocationLabel(cityRaw) ||
      getLocationItemLabel(profile?.cities, city) ||
      address.city ||
      address.city_name ||
      address.cityName ||
      profile.city ||
      profile.city_name ||
      profile.cityName ||
      getReadableLocationValue(cityRaw);

    if (country) {
      setSelCountry(country);
      setStateData(country);
    }
    if (state) {
      setSelState(state);
      setCountyData(state);
    }
    if (county) {
      setSelCounty(county);
      setCityData(county);
    }
    if (city) {
      setSelCity(city);
    }

    setProfileCityLabel(cityLabel);
    setChangeCity(false);
    setSelectedCity(null);
  };


  const { setModalDetails } = useContext(ModalContext);

  const [changeCat, setChangeCat] = useState(false);


  const backHandlerClickCount = useRef(0);
  const ModalClickCount = useRef(false);
  const secondsCountClick = useRef(0);
  const onOfferCardClickRef = useRef('');

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (ModalClickCount?.current) {
          if (onOfferCardClickRef?.current?.type == 'paid') {
            if (secondsCountClick.current === 0) {
              closeAdd();
              return true;
            }

            else {
              ToastAndroid.show('Pleas wait', ToastAndroid.SHORT);
              return true;
            }
          } else {
            closeAdd();
          }
          return true;
        }
        else if (!ModalClickCount?.current) {
          if (backHandlerClickCount.current === 0 && route.name === 'Home') {
            ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
            backHandlerClickCount.current += 1;

            setTimeout(() => {
              backHandlerClickCount.current = 0;
            }, 1000);

            return true;
          }

          if (route.name === 'Home') {
            BackHandler.exitApp();
            return true;
          }
        }


        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [route.name])
  );

  useLayoutEffect(() => {
    setChangeCat(false);
  },)

  // useEffect(()=>{
  //    let intervalIDS = setInterval(()=>{
  //     let key = Math.random();
  //     setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}`);
  //     // categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === selCategory?.uuid), 1)[0]);
  //     // setSelCategory(categoryList[0])
  //     setChangeCat(true)
  //    },30000)
  //    return ()=> clearInterval(intervalIDS)
  // },[])



  useEffect(() => {
    if (route.params != undefined) {
      if (route.params.category_uuid != undefined && route.params.brand_uuid != undefined) {
        if (route.params.category_uuid && route.params.brand_uuid && route.params.sub_category_uuid) {
          // categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid), 1)[0]);
          // alert(route.params.brand_uuid)
          setChangeCat(true)
          setSubCatActive(route.params.sub_category_uuid)
          setActBrand(route.params.brand_uuid);
        } else {
          let key = Math.random();
          setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
          // categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid.uuid), 1)[0]);
          const foundCategory = categoryList?.find(
            cat => cat.value === route.params.category_uuid.uuid || cat.uuid === route.params.category_uuid.uuid
          );
          if (foundCategory) {
            const categoryObj = { ...foundCategory, value: foundCategory.uuid };
            setSelCategory(categoryObj);
            setActiveCategory(foundCategory);
          }
          setChangeCat(true)
          setActBrand(route.params.brand_uuid);
        }

      } else if (route.params.brand_uuid != undefined) {
        setActBrand(route.params.brand_uuid);
          setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&brand_uuid=${route.params.brand_uuid}`);

      } else if (route.params.category_uuid != undefined) {
        // categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid.uuid), 1)[0]);
        const foundCategory = categoryList.find(
          cat => cat.value === route.params.category_uuid.uuid || cat.uuid === route.params.category_uuid.uuid
        );
        if (foundCategory) {
          const categoryObj = { ...foundCategory, value: foundCategory.uuid };
          setSelCategory(categoryObj);
          setActiveCategory(foundCategory);
        }
        setChangeCat(true)
      }
    }
  }, [route.params])
  // useFocusEffect(useCallback(()=>{
  //   let key = Math.random();
  //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&brand_uuid=${actBrand}&key=${key}`);
  // },[]))

  useEffect(() => {
    if (seconds == 0) {
      if (redeemSuccessMessage != "") {
        onLoad();
        let key = Math.random();
        setBrandPayload(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand) ? `&brand_uuid=${actBrand}` : ''}`);
        if (offerCard?.type == 'paid' && offerCard?.is_seen != 'true') {
          Toast.show(redeemSuccessMessage, Toast.LONG, {
            backgroundColor: '#45B39D',
          })
        }
      }
    }
  }, [seconds])

  const { start, stop, setTimer } = useInterval(count => {

    if (offerCard?.type == 'paid' && offerCard?.is_seen === 'true') {
      secondsCountClick.current = 0
    }
    else {
      setSeconds(count);
      secondsCountClick.current = count
      if (count === 18) {
        setSeconds(0);
        secondsCountClick.current = 0
        setRedeemedOfferIndexes([...redeemedOfferIndexes, selectedOfferIndex]);
        setSelectedOfferIndex();
        // setIsOfferClicked(false);

        // if (offerCard?.type == 'paid' && offerCard?.is_seen != 'true') {

        //   // setModalDetails({
        //   //   modalType: 'dialog',
        //   //   isOpen: true,
        //   //   modalContent: (
        //   //     <RedeemModalContent
        //   //       points= {redeemSuccessMessage}
        //   //       totalAmount={userDetails?.rewards?.point}
        //   //       onActionClick={() => setModalDetails({})}
        //   //     />
        //   //   ),
        //   //   modalStyles: {
        //   //     containerStyles: {
        //   //       alignItems: 'center',
        //   //     },
        //   //     contentStyles: {
        //   //       alignItems: 'center',
        //   //     },
        //   //   },
        //   //   actions: [],
        //   // });
        // }
        stop();
      }
    }
  });

  const styles = homeScreenStyles();

  const isOfferContentDrawerActive = drawerContentRoute === "offerCard";
  const selectedStoreUuid = Array.isArray(selBrand) ? selBrand[0] : selBrand;
  const selectedStore = Array.isArray(barndList)
    ? barndList.find(item => item?.uuid === selectedStoreUuid)
    : null;
  const storeTabs = useMemo(() => {
    if (!selectedStoreUuid) {
      return subCategoryList || [];
    }

    return [
      {
        uuid: DO_YOU_KNOW_TAB_UUID,
        name: 'Do you Know',
        mails_count: 0,
        isProfileTab: true,
      },
      ...(subCategoryList || []),
    ];
  }, [selectedStoreUuid, subCategoryList]);
  const storeProfileQuery = useQuery({
    queryKey: ['store-profile', {storeUuid: selectedStoreUuid}],
    queryFn: () => fetchStoreProfile(selectedStoreUuid),
    enabled: !!selectedStoreUuid,
    refetchInterval: 30000,
  });

  const buildMailPayload = useCallback(
    subCategoryUuid => {
      if (
        !subCategoryUuid ||
        subCategoryUuid === DO_YOU_KNOW_TAB_UUID ||
        !selectedCategoryUuid ||
        !userDetails?.uuid ||
        !selCountry
      ) {
        return '';
      }

      const queryParts = [
        `country_uuid=${selCountry}`,
        `state_uuid=${selState || ''}`,
        `city_uuid=${selCity || ''}`,
        `sub_category_uuid=${subCategoryUuid}`,
        `user_uuid=${userDetails?.uuid}`,
        `county_uuid=${selCounty || ''}`,
        `brand_uuid=${getBrandQueryValue(selBrand)}`,
        `category_uuid=${selectedCategoryUuid}`,
        'type=filter',
        'search=',
        'pagenum=',
        'limit=',
        `seen=${seen === false ? '' : 'no'}`,
      ];

      return queryParts.join('&');
    },
    [
      selCountry,
      selState,
      selCity,
      selCounty,
      selBrand,
      selectedCategoryUuid,
      seen,
      userDetails?.uuid,
    ],
  );

  useEffect(() => {
    if (changeCity === true) return;
    const userCityRaw = getProfileLocationRawValue(userDetails, 'city');
    const userCity = getProfileLocationUuid(userDetails, 'city', userCityRaw);
    const userCountry = getProfileLocationUuid(userDetails, 'country', getProfileLocationRawValue(userDetails, 'country'));
    const userState = getProfileLocationUuid(userDetails, 'state', getProfileLocationRawValue(userDetails, 'state'));
    const userCounty = getProfileLocationUuid(userDetails, 'county', getProfileLocationRawValue(userDetails, 'county'));

    if (userCountry) setSelCountry(userCountry);
    if (userState) setSelState(userState);
    if (userCounty) setSelCounty(userCounty);
    if (userCity || changeCity === true) {
      setSelCity(changeCity === true ? getProfileLocationValue(selectedCity) : userCity);
    }
    setProfileCityLabel(getProfileLocationLabel(userCityRaw));
    if (userCountry) {
      setStateData(userCountry);
    }
    if (userState) {
      setCountyData(userState);
    }
    if (userCounty) {
      setCityData(userCounty);
    }
    if (userCity) {
      setSelCity(changeCity === true ? getProfileLocationValue(selectedCity) : userCity);
    }
  }, [changeCity, userDetails?.address])

  useEffect(() => {
    if (changeCity === true) return;
    // if (categoryList?.length > 0) setSelCategory(categoryList[0]);
    // (categoryList?.length > 0) ? setActiveCategory(categoryList[0]) : setActiveCategory('');
    if (location.country?.uuid) setSelCountry(location.country?.uuid)
    if (location.state?.uuid) setSelState(location.state?.uuid)
    if (location.county?.uuid) setSelCounty(location.county?.uuid)
    if (location.city?.uuid) setSelCity(changeCity === true ? getProfileLocationValue(selectedCity) : location.city?.uuid)
  }, [changeCity, location])

  useEffect(() => {
    if (route.params?.category_uuid) {
      const foundCategory = route.params?.category_uuid
      const categoryObj = { ...foundCategory, value: foundCategory.uuid };
      setSelCategory(categoryObj);
      setActiveCategory(foundCategory)
    } else if (categoryList?.length > 0) {
      setSelCategory(selCategory ? selCategory : categoryList[0]);
      setActiveCategory(selCategory ? selCategory : categoryList[0])
    }
  }, [categoryList])

  useEffect(() => {
    if (!Array.isArray(barndList) || barndList.length === 0) {
      return;
    }

    const selectedBrandUuid = Array.isArray(selBrand) ? selBrand[0] : selBrand;
    const firstBrandExists = barndList.some(b => b?.uuid === selectedBrandUuid);
    if ((!selectedBrandUuid || !firstBrandExists) && barndList[0]?.uuid) {
      setSelBrand([barndList[0].uuid]);
      setActiveBrand(barndList[0].uuid);
      setSubCatActive(DO_YOU_KNOW_TAB_UUID);
      setTabindexs(0);
      setSubCheck(true);
    }
  }, [barndList, selBrand, setActiveBrand])

  useEffect(() => {
    if (hasCategoryFilters) {
      let key = Math.random();
      setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState || ''}&city_uuid=${selCity}&county_uuid=${selCounty || ''}`);
    }
  }, [hasCategoryFilters, selectedCategoryUuid, selBrand, selCountry, selState, selCounty, selCity, userDetails?.uuid])

  const onLoad = () => {
    if (!userDetails?.uuid) {
      return;
    }

    if (hasCategoryFilters) {
      setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState || ''}&city_uuid=${selCity}&county_uuid=${selCounty || ''}`);
    }
    // setSubCatPayload(`search=`);
    // setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(selBrand)?`&brand_uuid=${selBrand}`:''}`);

    setPayload(`page_name=home`);
    // setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(activeBrand)?`&brand_uuid=${activeBrand}`:''}`);
    let key = Math.random();
    if (hasLocationFilters) {
      setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
    }
    // if (changeCity === true) {
    //   let key = Math.random();
    //   // setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
    //   setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
    // }
    // else {
    //   let key = Math.random();
    //   // setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
    //   setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}`);
    // }
    setCountry(`page=0&limit=10&search=United States`);
    // if (subCatActive && (selCountry || selState || selCounty || selCity)) setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&type=filter&}&brand_uuid=${selBrand}`)
  }


  // useEffect(()=>{
  //    if(subCategoryList?.length > 0){
  //     let data = subCategoryList.filter(item=> item?.mails_count > 0)
  //     if(data){
  //       setSelCategory(data[0])
  //     }
  //     // setSelCategory()
  //    }
  // },[subCategoryList])

  useEffect(() => {
    onLoad();
  }, [hasCategoryFilters, hasLocationFilters, selCountry, selState, selCounty, selCity, selectedCity, changeCity, userDetails?.uuid, selectedCategoryUuid]);

  useEffect(() => {
    // if(actBrand !="" && selCategory?.uuid){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }else if(selCategory?.uuid  && actBrand == ""){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }
    if (hasCategoryFilters) {
      setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState || ''}&city_uuid=${selCity}&county_uuid=${selCounty || ''}${(actBrand) ? `&brand_uuid=${actBrand}` : ''}`);
    }
  }, [hasCategoryFilters, selectedCategoryUuid, actBrand, selCountry, selState, selCounty, selCity, userDetails?.uuid])
  useEffect(() => {
    setSubCatBrand(selBrand);

    if (hasCategoryFilters && selBrand != "") {
      let key = Math.random();
      setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selectedCategoryUuid}&country_uuid=${selCountry}&state_uuid=${selState || ''}&city_uuid=${selCity}&county_uuid=${selCounty || ''}`);
    }
  }, [hasCategoryFilters, selBrand, selectedCategoryUuid, selCountry, selState, selCounty, selCity, userDetails?.uuid])

  useEffect(() => {
    const nextPayload = buildMailPayload(subCatActive);
    if (nextPayload) {
      setMailPayload(nextPayload);
    }
  }, [buildMailPayload, subCatActive, setMailPayload, setUpdateBrandFav, setUpdateMailFav])
  // useFocusEffect(useCallback(()=>{
  //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
  //   barndList.map((it)=>{
  //     if(it.uuid == 'ST-039AAD12'){
  //     }
  //  })
  // },[])
  // )

  useEffect(() => {
    if (!Array.isArray(subCategoryList) || subCategoryList.length === 0) {
      return;
    }

    // When a different store is selected, default to "Do you Know" once.
    if (selectedStoreUuid) {
      if (previousSelectedStoreUuidRef.current !== selectedStoreUuid) {
        previousSelectedStoreUuidRef.current = selectedStoreUuid;
        setSubCatActive(DO_YOU_KNOW_TAB_UUID);
        setTabindexs(0);
        setSubCheck(true);
      }
      return;
    }

    previousSelectedStoreUuidRef.current = '';

    const currentTabExists = subCategoryList.some(item => item?.uuid === subCatActive);
    if (subCheck && currentTabExists) {
      return;
    }

    const nextTab =
      subCategoryList.find(item => item?.is_mail_available === "true") ||
      subCategoryList.find(item => Number(item?.mails_count || 0) > 0) ||
      subCategoryList[0];
    const nextIndex = subCategoryList.findIndex(item => item?.uuid === nextTab?.uuid);

    if (nextTab?.uuid && nextTab.uuid !== subCatActive) {
      setSubCatActive(nextTab.uuid);
    }

    if (nextIndex >= 0) {
      setTabindexs(nextIndex);
    }
  }, [subCategoryList, subCheck, subCatActive, selectedStoreUuid])


  const onTabChane = (subCategoryIndexOrUuid) => {
    const selectedTab =
      typeof subCategoryIndexOrUuid === 'number'
        ? storeTabs?.[subCategoryIndexOrUuid]
        : storeTabs?.find(item => item?.uuid === subCategoryIndexOrUuid);
    const selectedTabUuid = selectedTab?.uuid;

    if (!selectedTabUuid) {
      return;
    }

    setSubCatActive(selectedTabUuid);
    setSubCheck(true);

    if (selectedTabUuid === DO_YOU_KNOW_TAB_UUID) {
      return;
    }

    const nextPayload = buildMailPayload(selectedTabUuid);
    if (nextPayload) {
      setMailPayload(nextPayload);
    }
  };

  const toggleSwitch = () => {
    // if (changeCity === true) {
    //   let key = Math.random();
    //   setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=${seen === false ? '' : 'no' }`)
    // }
    // else {
    //   let key = Math.random();
    //   setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=${seen === false ? '' : 'no' }`)
    // }
    // setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=${seen === false ? '' : 'no' }`)
    setSeen(previousState => !previousState)
  }




  const handleNavLinksClick = (route, item) => {
    if (item?.mime_type === 'text/html') {
      const url = item?.image_url?.split('/');
      setMailURL({ html_url: url.slice(-1)[0] })
    }
    setIsAnimate(false);
    setOfferCard(item);
    setShowDrawer(true);
    setDrawerContentRoute(route);
    setUpdateMailRedeem({
      user_uuid: userDetails?.uuid,
      mail_uuid: item?.uuid
    });
  };

  const toggleDrawer = (event) => {
    if (
      (event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")) ||
      isOfferContentDrawerActive
    ) {
      return;
    }

    setShowDrawer(false);
  };

  const onFavouriteToggle = (brand_uuid) => {
    setUpdateBrandFav({
      user_uuid: userDetails?.uuid,
      brand_uuid: brand_uuid
    });
  }

  const onFavouriteMailToggle = (mail_uuid) => {
    setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: mail_uuid
    });
  }

  const [subCheck, setSubCheck] = useState(false);

  const onChangeCategoryHandler = async (val) => {
    if (!val) return;
    const isExist = selCategory === val ? true : false;
    if (!isExist) {
      setActBrand("");
      setSubCheck(false);
      setSelBrand([]);
      setSubCatActive(DO_YOU_KNOW_TAB_UUID);
      setTabindexs(0);
    }
    else {
      setSubCheck(true);
    }
    setActiveCategory(val)
    setSelCategory(val);
  }

  //   useEffect(()=>{
  //     setInterval(()=>{
  //         let key = Math.random();
  //         alert(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`)
  //         setBrandPayload(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);

  //     },30000)
  //   },[])


  const onBrandSelect = (e, brandId) => {
    if (!brandId) return;
    const brand = e ? [brandId] : selBrand.filter((el) => el !== brandId);
    setSelBrand([...brand]);
    setActiveBrand(brandId)
    setSubCatActive(DO_YOU_KNOW_TAB_UUID);
    setTabindexs(0);
    setSubCheck(true);
  }

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const getOfferDetailsContent = () => (
    <>
      <View style={{ backgroundColor: "#FFFFFF", flex: 1, minWidth: screenWidth - 10 }}>

        <View>
          <View style={styles.timerContainer}>
            {/* <Text style={styles.secondsCounter}>{18 - seconds}</Text> */}
            {seconds > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 18 }}>Please Wait...</Text></View>}
            {seconds == 0 && <TouchableOpacity onPress={closeAdd} style={{
              backgroundColor: '#45B39D',
              borderRadius: 10,
              padding: 10,
              // maxWidth: 'auto',
              // marginLeft: 'auto',
            }}>
              <EntypoIcon
                name="chevron-left"
                size={22}
                style={styles.favIcon}
              />
            </TouchableOpacity>
            }
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18, padding: 5 }}>{offerCard?.message}</Text>
          </View>
          {(offerCard?.mime_type === 'text/html' && offerCard?.image_url) && <View style={{ flex: 1 }}><WebView
            source={{
              html: mailHTML
              // uri: `${offerCard?.image_url}`,
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: screenWidth - 10,
              minHeight: '40%'
            }}
          /></View>}

          {(offerCard?.mime_type === 'application/pdf') && <Pdf
            source={{
              uri: offerCard?.image_url,
              cache: true
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages) => {
            }}
            onError={(error) => {
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
          }


          {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') && <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode="contain"
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
              source={{ uri: `${offerCard?.image_url}` }}
            />
          </View>}

          {(offerCard?.mime_type === '' && offerCard?.video_url) && <View style={{ flex: 1 }}>
            <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              source={{
                uri: `${offerCard?.video_url}?controls=0&showinfo=0&wmode=transparent&rel=0&mode=opaque`,
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: screenWidth - 10,
                minHeight: '40%'
              }}
              onError={(err) => {
                alert(err);
              }}
            />
          </View>}
        </View>
      </View>
    </>
  );

  const closeAdd = () => {
    setSeconds(18);
    secondsCountClick.current = 18
    setIsOfferClicked(false);
    ModalClickCount.current = false;
    setTimer(0);
    stop();
    setModalDetails({})
  }

  useEffect(() => {
    if (modalVisible && PopUpAddData?.[0]?.image) {
      FastImage.preload([{ uri: PopUpAddData?.[0].image }]);
    }
  }, [modalVisible]);

  const getOfferDetailsContentWithoutTimer = () => (
    <>


      <View style={{ backgroundColor: "#FFFFFF", flex: 1, minWidth: screenWidth - 10 }}>

        <View>
          <View style={styles.timerContainer}>
            <TouchableOpacity onPress={closeAdd} style={{
              backgroundColor: '#45B39D',
              borderRadius: 10,
              padding: 10,
              // maxWidth: 'auto',
              // marginLeft: 'auto',
            }}>
              <EntypoIcon
                name="chevron-left"
                size={22}
                style={styles.favIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#000000', fontSize: 18, padding: 5 }}>{offerCard?.message}</Text>
          </View>

          {(offerCard?.mime_type === 'text/html' && offerCard?.image_url) && <View style={{ flex: 1 }}>
            {/* <Text>{mailHTML}</Text> */}
            <WebView
              source={{
                html: mailHTML
                // uri: `${offerCard?.image_url}`,
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: screenWidth - 10,
                minHeight: '40%'
              }}
            /></View>}
          {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') &&
            <View style={{ flex: 1 }}>
              <Image
                resizeMode="contain"
                style={{
                  width: Dimensions.get('window').width,
                  // height: Dimensions.get('window').height,
                  height: 600
                }}
                source={{ uri: `${offerCard?.image_url}` }}
              />
            </View>
          }

          {(offerCard?.mime_type === 'application/pdf') && <Pdf
            source={{
              uri: offerCard?.image_url,
              cache: true
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages) => {
            }}
            onError={(error) => {
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
          }

          {(offerCard?.mime_type === '' && offerCard?.video_url) && <View style={{ flex: 1 }}>

            {/* <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          source={{
            // uri: `https://www.youtube.com/embed/${getYouTubeVideoId(offerCard?.video_url)}?rel=0&autoplay=0&showinfo=0&controls=0`
            uri: `${offerCard?.video_url}?controls=0&showinfo=0&wmode=transparent&rel=0&mode=opaque`,
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: screenWidth - 10,
            minHeight: '40%'
          }}
          onError={(err) => {
            alert(err);
          }}
        /> */}
            <YouTubePlayer videoUrl={`${offerCard.video_url}`} />
          </View>}
        </View>
      </View>

    </>
  );

  useEffect(() => {
    if (isOfferClicked) {
      start();
    }
  }, [isOfferClicked]);

  useEffect(() => {
    if (isOfferClicked) {

      setModalDetails({
        modalType: 'blurView',
        isOpen: true,
        modalContent: (offerCard?.type == 'paid' && offerCard?.is_seen == 'false') ? getOfferDetailsContent() : getOfferDetailsContentWithoutTimer(),
        modalStyles: {
          containerStyles: {
            alignItems: 'center',
            marginTop: 0
          },
          contentStyles: {
            alignItems: 'center',
          },
        },
        actions: [],
      });
    }
  }, [seconds, isOfferClicked]);

  const onOfferCardClick = (index, item) => {
    if (!redeemedOfferIndexes.includes(index)) {
      setTimerShow(true);
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      ModalClickCount.current = true;
      onOfferCardClickRef.current = item;
      setOfferCard(item);
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] })
      }
      setUpdateMailRedeem({
        user_uuid: userDetails?.uuid,
        mail_uuid: item?.uuid
      });
      // if(item?.type == 'paid' && item?.is_seen == 'false'){
      //   setUpdateMailRedeem({
      //     user_uuid: userDetails?.uuid,
      //     mail_uuid: item?.uuid
      //   });
      // }

    }
    else {
      setTimerShow(false);
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      ModalClickCount.current = true;
      setOfferCard(item);
      onOfferCardClickRef.current = item;
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] })
      }
      setUpdateMailRedeem({
        user_uuid: userDetails?.uuid,
        mail_uuid: item?.uuid
      });
      // if(item?.type == 'paid' && item?.is_seen == 'false'){
      //   setUpdateMailRedeem({
      //     user_uuid: userDetails?.uuid,
      //     mail_uuid: item?.uuid
      //   });
      // }

    }
  };
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSeen = async (image) => {
    try {
      await axios.put(`${baseUrl}/modal/seen`, {
        modal_uuid: image,
        user_uuid: userDetails?.uuid
      }, {
        headers: {
          "x-auth-token": userDetails?.token
        }
      }).then((res) => {
        console.log("API triggered for: Modal")
      })
      console.log('API triggered for:', image);
    } catch (error) {
      console.error('Error API triggered for:', error);
    }
  };

  const updateStorySeen = () => {
    axios.put(`${baseUrl}/user/popup/seen`, {
      "user_uuid": userDetails?.uuid
    }, {
      headers: {
        "x-auth-token": userDetails?.token
      }
    })
      .then((res) => {
        console.log("API triggered for: user popup seen")
      })
      .catch((err) => {
        console.log('err : ', err)
      })
  }

  const updateStorySeenPopup = (popupID) => {
    axios.put(`${baseUrl}/popup/seen`, {
      "user_uuid": userDetails?.uuid,
      popup_uuid: popupID
    }, {
      headers: {
        "x-auth-token": userDetails?.token
      }
    })
      .then((res) => {
        console.log("API triggered for: popup seen")
      })
      .catch((err) => {
        console.log('err : ', err)
      })
  }


  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % PopUpAddData.length;
    setCurrentIndex(nextIndex);

    // PopUpAddData.forEach((item) => {
    //   setPayloadsPopupseenuser({
    //     // uuid
    //     user_uuid: userdata?.uuid,
    //     popup_uuid: item?.uuid
    //   })
    // })
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + PopUpAddData?.length) % PopUpAddData?.length;
    setCurrentIndex(prevIndex);
    handleImageSeen(PopUpAddData?.[prevIndex]?.uuid);
  };

  const openModal = () => {
    setModalVisible(true);
    setPopUpAds(`?user_uuid=${userDetails?.uuid}`);
  }


  const closeModal = () => {
    handleImageSeen(PopUpAddData?.[0]?.uuid);
    updateStorySeen();
    axios.get(`${baseUrl}/popup/list?user_uuid=${userDetails?.uuid}`, {
      headers: {
        "x-auth-token": userDetails?.token
      }
    })
      .then((res) => {
        res?.data?.data.forEach((item) => {
          updateStorySeenPopup(res?.data?.data?.uuid)
        })
      })
      .catch((err) => {
        console.log(err, "errr")
      })
    setModalVisible(false);
  };


  const getProfileData = () => {
    if (!userDetails?.uuid) return;

    axios.get(`${baseUrl}/user/consumer/get/profile/${userDetails?.uuid}`, {
      headers: {
        'x-auth-token': userDetails?.token
      }
    })
      .then((res) => {
        const profileData = res?.data?.data || {};

        syncProfileLocation(profileData);

        if (profileData?.pop_up === false) {
          openModal();
        }
        else if (profileData?.pop_up === true) {
          closeModal();
        }
      })
      .catch((err) => {
        closeModal();
      });
  };

  const [addlistData, setaddlistData] = useState([])
  const getHomeAdImage = item =>
    item?.image ||
    item?.image_url ||
    item?.url ||
    item?.banner ||
    item?.file ||
    item?.file_url ||
    '';

  const getAddsList = () => {
    axios.get(`${baseUrl}/add/get?page_name=home`, {
      headers: {
        "x-auth-token": userDetails?.token
      }
    })
      .then((res) => {
        setaddlistData(res?.data?.data);
      })
      .catch((err) => {
        setaddlistData([]);
      })
  }


  useEffect(() => {
    getProfileData();
    getAddsList();
  }, [userDetails])


  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const screenWidthss = Dimensions.get('window').width;



  const defaultDataWith6Colors = [
    "#B0604D",
    "#899F9C",
    "#B3C680",
    "#5C6265",
    "#F5D399",
    "#F1F1F1",
  ];

  const renderItem = ({ item }) => (
    <View style={styles.homeAdCard}>
      <Image
        source={{ uri: getHomeAdImage(item) }}
        style={styles.homeAdImage}
        resizeMode="cover"
      />
    </View>
  );

  const homeAds = Array.isArray(addlistData)
    ? addlistData.filter(item => !!getHomeAdImage(item))
    : [];

  useEffect(() => {
    if (route.params?.brand_uuid) {
      setActBrand(route.params.brand_uuid);
      // setSelBrand([route.params.brand_uuid]);
      onBrandSelect(true, route.params.brand_uuid)
    }

    if (route.params?.category_uuid && Array.isArray(categoryList) && categoryList.length > 0) {
      const foundCategory = categoryList.find(
        cat => cat.value === route.params.category_uuid.uuid || cat.uuid === route.params.category_uuid.uuid
      );
      if (foundCategory) {
        const categoryObj = { ...foundCategory, value: foundCategory.uuid };

        setSelCategory(categoryObj);
        setActiveCategory(foundCategory);


        setSelCategory(foundCategory);
        setActiveCategory(foundCategory);
      }
    }
  }, [route.params?.brand_uuid, route.params?.category_uuid, categoryList]);

  const renderCategorySection = () => (
    <View style={styles.filterSection}>
      <View pointerEvents="none" style={styles.categoryDoodleLayer}>
        {categoryDoodleItems.map((item, index) => (
          <EntypoIcon
            key={`${item.name}-${index}`}
            name={item.name}
            size={item.size}
            color={themeColors.white}
            style={[
              styles.categoryDoodleIcon,
              {
                top: item.top,
                left: item.left,
                right: item.right,
                transform: [{ rotate: item.rotate }],
              },
            ]}
          />
        ))}
      </View>
      {categoryList?.length > 0 && !changeCat && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroller}>
          {categoryList.map((item, i) => {
            const isSelectedCategory = selCategory?.uuid === item?.uuid || selCategory?.value === item?.uuid;
            return (
              <TouchableOpacity
                key={item?.uuid || i}
                activeOpacity={0.85}
                onPress={() => onChangeCategoryHandler(item)}
                style={styles.categoryChip}>
                <View style={styles.categoryIconWrap}>
                  {item?.image ? (
                    <Image resizeMode="cover" style={styles.categoryImage} source={{ uri: `${item.image}` }} />
                  ) : (
                    <EntypoIcon name="grid" size={20} color={themeColors.fontPrimary} />
                  )}
                </View>
                <Text style={[
                  styles.categoryChipText,
                  isSelectedCategory ? styles.categoryChipTextActive : null,
                ]} numberOfLines={1}>
                  {item?.name || item?.title || 'Category'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        locationTitle={
          selectedCity?.name ||
          selectedCity?.label ||
          profileCityLabel ||
          cityName ||
          'City'
        }
        onLocationPress={() => setIsCityPickerVisible(true)}
        onProfilePress={() => navigation.navigate('AccountMenu')}
      />
      <Modal
        animationType="fade"
        transparent
        visible={isCityPickerVisible}
        onRequestClose={() => setIsCityPickerVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styless.cityPickerBackdrop}
          onPress={() => setIsCityPickerVisible(false)}>
          <View
            style={styless.cityPickerCard}
            onStartShouldSetResponder={() => true}>
            <Text style={styless.cityPickerTitle}>Choose a city</Text>
            {isAllCitiesLoading ? (
              <ActivityIndicator color="#168F79" style={styless.cityPickerLoader} />
            ) : (
              <FlatList
                data={sortedCities}
                keyExtractor={item => item?.uuid}
                ListEmptyComponent={
                  <Text style={styless.cityPickerEmpty}>No cities available</Text>
                }
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => selectCity(item)}
                    style={[
                      styless.cityPickerItem,
                      item?.uuid === selCity && styless.cityPickerItemSelected,
                      index === 0 &&
                        item?.uuid === homeCityUuid &&
                        sortedCities.length > 1 &&
                        styless.cityPickerHomeItem,
                    ]}>
                    <Text
                      style={[
                        styless.cityPickerItemText,
                        item?.uuid === selCity &&
                          styless.cityPickerItemTextSelected,
                      ]}>
                      {getCityPickerLabel(item)}
                      {item?.uuid === homeCityUuid ? ' (Home)' : ''}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
      {renderCategorySection()}
      <ScrollView

        style={[styles.pageContainer]}
        // contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        <View style={{ flex: 1 }}>
          {/* {userDetails?.uuid && userDetails?.token &&
            <StoriesScreen userId={userDetails?.uuid} userToken={userDetails?.token} />
          } */}
          {data?.length > 0 && <OffersCarousal data={data} />}
          {homeAds.length > 0 && (
            <FlatList
              data={homeAds}
              horizontal
              pagingEnabled
              renderItem={renderItem}
              keyExtractor={(item, index) => item?.uuid || item?._id || `${index}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.homeAdList}
              snapToInterval={screenWidthss - 24}
              decelerationRate="fast"
            />
          )}
          <CampaignsPanel navigation={navigation} />
          <View style={styless.container123}>
            {/* Modal component */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => { closeModal() }}
            >
              <View style={styless.modalOverlay}>
                <View style={styless.modalContainer}>
                  <TouchableOpacity onPress={() => closeModal()} style={{ position: "absolute", top: 5, flex: 1, zIndex: 999, alignSelf: "flex-end" }}>
                    <EntypoIcon name='circle-with-cross' size={30} />
                  </TouchableOpacity>
                  {loading && (
                    <ActivityIndicator size="large" color="#000" style={{ position: 'absolute', top: '45%', alignSelf: 'center' }} />
                  )}
                  <FastImage
                    source={{ uri: PopUpAddData?.[0]?.image }}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={FastImage.resizeMode.contain}
                    onLoadStart={() => {
                      console.log('Image loading started');
                      setLoading(true);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully');
                      setLoading(false);
                    }}
                  />
                  {/* <Image
                    source={{ uri: PopUpAddData?.[0]?.image }}
                    style={{ height: "100%", width: "100%", objectFit: 'contain' }}
                  /> */}
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.brandIconCardsWrapper}>
            {barndList?.length >= 1 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.homeStoreScroller}>
                {barndList.slice(0, 10).map((item, i) => (
                  <BrandIconCard
                    variant="storeFeature"
                    isActive={selBrand?.indexOf(item?.uuid) !== -1 || item?.is_highlight === 'true' ? true : false}
                    key={item?.uuid || i}
                    item={item}
                    isFavourite={item?.is_faviourate === 'true' ? true : false}
                    wrapperStyles={styles.homeStoreFeature}
                    onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid)}
                    onBrandSelect={(e) => onBrandSelect(e, item?.uuid)}
                    src={item?.logo_url}
                    showActionByDefault={true}
                  />
                ))}
              </ScrollView>
            ) : (
              !isBrandLoading && (
                <View style={styles.emptyStoreState}>
                  <View style={styles.emptyStoreIconWrap}>
                    <Ionicons name="storefront-outline" size={36} color={themeColors.fontMuted} />
                  </View>
                  <Text style={styles.emptyStoreTitle}>No Stores Available</Text>
                  <Text style={styles.emptyStoreSubText}>Stores for this category are coming soon. Please check back later.</Text>
                </View>
              )
            )}
          </View>
        </View>

        {barndList?.length >= 1 && storeTabs.length > 0 && <TabView
          tabs={storeTabs}
          actTab={subCatActive}
          subCheck={subCheck}
          onTabChange={(index) => onTabChane(index)}
          tabContentBaseStyles={{
            paddingBottom: 16,
          }}
          renderActiveTabContent={() => (
            <>
              {subCatActive === DO_YOU_KNOW_TAB_UUID ? (
                <DoYouKnowSection
                  data={storeProfileQuery.data}
                  fallbackStore={selectedStore}
                  hasSelectedBrand={!!selectedStoreUuid}
                  hasData={!!storeProfileQuery.data}
                  isLoading={storeProfileQuery.isLoading}
                  errorMessage={storeProfileQuery.error?.message || ''}
                />
              ) : (
              <View style={styles.mailSection}>
                <View style={styles.mailToolbar}>
                  <Switch
                    trackColor={{ false: '#D0D5DD', true: '#81b0ff' }}
                    thumbColor={seen ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#D0D5DD"
                    onValueChange={toggleSwitch}
                    value={seen}
                    style={styles.mailToggle}
                  />
                </View>

                {mailList?.length > 0 ? (
                  <ScrollView>
                    <View style={styles.tabContent}>
                      {mailList.map((_item, idx) => {
                        return (
                          <OfferCard
                            variant="reward"
                            containerStyles={{
                              marginBottom: idx + 1 < mailList?.length ? 14 : 0,
                            }}
                            isRedeemed={_item?.is_seen === 'true' ? true : false}
                            onTap={() => onOfferCardClick(idx, _item)}
                            isFavourite={_item?.is_favourite === 'true' ? true : false}
                            onFavouriteToggle={(e) => onFavouriteMailToggle(_item?.uuid)}
                            key={idx}
                            item={_item}
                          />
                        )
                      })}
                    </View>
                  </ScrollView>
                ) : !isMailLoading && (
                  <View style={styles.emptyMailState}>
                    <View style={styles.emptyMailIconWrap}>
                      <Ionicons name="search-outline" size={34} color={themeColors.fontMuted} />
                    </View>
                    <Text style={styles.emptyMailTitle}>No Results Found</Text>
                    <Text style={styles.emptyMailText}>Try another category or check back for new mail.</Text>
                  </View>
                )}
              </View>
              )}
              {subCatActive !== DO_YOU_KNOW_TAB_UUID && mailCount > 0 && !isMailLoading && <View style={{ marginTop: -20, width: '100%', display: 'flex', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('Mails', { category_uuid: selCategory?.uuid, sub_cat_uuid: subCatActive, brand_uuid: selBrand })}>
                      <EntypoIcon
                        name="arrow-right"
                        size={22}
                        style={styles.favIcon}
                      />
                    </TouchableOpacity> */}
              </View>}
              {/* {
                  isMailLoading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                } */}
            </>
          )}
        />}
      </ScrollView>
      {isCityTransitioning && (
        <View
          pointerEvents={'auto'}
          style={styless.cityTransitionOverlay}
          accessibilityRole={'progressbar'}
          accessibilityLabel={'Loading selected city'}>
          <View style={styless.cityTransitionLoader}>
            <ActivityIndicator color={'#168F79'} size={'small'} />
            <Text style={styless.cityTransitionText}>
              Loading {selectedCity?.name || 'city'}…
            </Text>
          </View>
        </View>
      )}

    </View>
  );
};

const styless = StyleSheet.create({
  cityTransitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    justifyContent: 'center',
    zIndex: 1000,
  },
  cityTransitionLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityTransitionText: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  cityPickerBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  cityPickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '70%',
    overflow: 'hidden',
    paddingBottom: 8,
    width: '100%',
  },
  cityPickerTitle: {
    color: '#17212B',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cityPickerLoader: {
    margin: 32,
  },
  cityPickerEmpty: {
    color: '#667085',
    padding: 20,
    textAlign: 'center',
  },
  cityPickerItem: {
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  cityPickerItemSelected: {
    backgroundColor: 'rgba(84, 172, 52, 0.14)',
  },
  cityPickerHomeItem: {
    borderBottomColor: '#EAECF0',
    borderBottomWidth: 1,
  },
  cityPickerItemText: {
    color: '#344054',
    fontSize: 15,
  },
  cityPickerItemTextSelected: {
    color: '#168F79',
    fontWeight: '700',
  },
  autocompleteContainer: {
    // flex: 1,
    left: 0,
    // position: 'absolute',
    paddingHorizontal: 0,
    right: 0,
    top: 0,
    zIndex: 1
  },
  container123: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  // modalOverlay: {
  //   flex: 1,
  //   position: 'absolute', // Ensure the overlay is absolutely positioned to cover the full screen
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',

  // },
  modalContainer: {
    width: "90%",
    height: "80%",
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 100,
    marginLeft: 20
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },

});

export default Home;
