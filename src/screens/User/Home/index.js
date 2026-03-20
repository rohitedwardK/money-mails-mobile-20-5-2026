import React, { useState, useEffect, useContext, useCallback, useLayoutEffect, useRef } from 'react';
import { Image, ActivityIndicator, ScrollView, Text, View, TouchableOpacity, StyleSheet, Platform, FlatList, Button, Dimensions, Switch, Modal, ToastAndroid, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import OffersCarousal from './OffersCarousal';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import { styles as homeScreenStyles } from './index.style';
import TabView from '../../../components/organisms/TabView';
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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { usePopUpAds } from '../../../hooks/services/usePopupads';
import getColors from '../../../utils/colors';
import { useRoute } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useFocusEffect } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-element-dropdown';
import Pdf from 'react-native-pdf';

import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import { baseUrl } from '../../../connections';
import StoriesScreen from './stories';
import Carousel from 'react-native-reanimated-carousel';

import FastImage from 'react-native-fast-image';

const arr = new Array(15).fill('');
const brandsArr = new Array(6).fill('');

const Home = ({ navigation }) => {
  const route = useRoute();
  const [actBrand, setActBrand] = useState("");
  const { offerCardColors: colors } = getColors();
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
  const { barndList, brandCount, isBrandLoading, brandError, setBrandPayload, setUpdateBrandFav } = useBrand();
  const { categoryList, isCatLoading, catError, setCatPayload, setData } = useCategory();
  const { subCategoryList = [], setSubCatPayload, setSubCatBrand } = useSubCategory();
  const { setPopUpAds, PopUpAddData } = usePopUpAds();

  const { mailList, isMailLoading, mailCount, isRedeem, redeemMessage, redeemSuccessMessage, redeemError, mailHTML, unsubscribeResult, unsubscribeError, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL, setUnsubscribeMail } = useMail();
  const [subCatActive, setSubCatActive] = useState();
  const { countryList, setCountry } = useCountry();
  const { countyList, setCounty } = useCounty();
  const { cityList, setCity } = useCity();
  const { stateList, setStates } = useStates();
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();
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
  const [cityName, setcityname] = useState()
  const [changeCity, setChangeCity] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null);
  const [seen, setSeen] = useState(false)

  const [HandleValue, setHandleValue] = useState([])



  useEffect(() => {
    const matchedCity = cityData?.find(city => city?.uuid === userDetails?.address?.city);
    if (matchedCity) {
      setcityname({
        label: matchedCity?.name,
        value: matchedCity?.uuid
      })
    }
    const dataOption = [{ value: '', label: 'All' }]
    cityData.map((item) => {
      dataOption.push({
        label: item.name,
        value: item.uuid
      })
    })

    setHandleValue(dataOption);
  }, [cityData])

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const getCityFormattedData = (HandleValueData) => {
    const formattedData = Array.isArray(HandleValueData)
      ? HandleValueData.map(item => ({
        label: item?.label || 'N/A',   // Default label if missing
        value: item?.value || ''        // Default value if missing
      }))
      : [];

    return formattedData;
  }
  // const HandleValue = [
  //   { label: 'All', value: '' },
  //   ...cityData.map((item) => ({
  //     label: item.name,
  //     value: item.uuid,
  //   }))
  // ];


  // Function to handle city selection logic
  const handleSelectCity = (city) => {
    const cityFilter = {
      label: city.label,
      value: city.value
    }

    if (city?.value === userDetails?.address?.city || city?.value === userDetails?.city) {
      setChangeCity(false);
      setSelCity(city.value);
      setSelectedCity(city.value);
      setcityname(cityFilter);


    } else {
      setChangeCity(true);
      setSelCity(city.value);
      setSelectedCity(city.value);
      setcityname(cityFilter);
    }
    let key = Math.random();
    setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${city?.value}`);
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
        setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&brand_uuid=${route.params.brand_uuid}`);

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
        setBrandPayload(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand) ? `&brand_uuid=${actBrand}` : ''}`);
        if (offerCard?.type == 'paid' && offerCard?.is_seen != 'true') {
          Toast.show(redeemSuccessMessage, Toast.LONG, {
            backgroundColor: '#45B39D',
          })
        }
      }
    }
  }, [seconds])

  useEffect(() => {
    if (unsubscribeResult) {
      Toast.show(unsubscribeResult, Toast.LONG, {
        backgroundColor: '#45B39D',
      });
    }
    if (unsubscribeError) {
      Toast.show(unsubscribeError, Toast.LONG, {
        backgroundColor: '#D64545',
      });
    }
  }, [unsubscribeResult, unsubscribeError]);

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

  useEffect(() => {
    setSelCountry(userDetails?.address?.country || userDetails?.country);
    setSelState(userDetails?.address?.state || userDetails?.state);
    setSelCounty(userDetails?.address?.county || userDetails?.county);
    setSelCity(changeCity === true ? selectedCity : userDetails?.address?.city || userDetails?.city);
    if (userDetails?.address?.country) {
      setStateData(userDetails?.address?.country);
    }
    if (userDetails?.address?.state) {
      setCountyData(userDetails?.address?.state);
    }
    if (userDetails?.address?.county) {
      setCityData(userDetails?.address?.county);
    }
    if (userDetails?.address?.city) {
      setSelCity(changeCity === true ? selectedCity : userDetails?.address?.city || userDetails?.city);
    }
  }, [userDetails?.address])

  useEffect(() => {
    // if (categoryList?.length > 0) setSelCategory(categoryList[0]);
    // (categoryList?.length > 0) ? setActiveCategory(categoryList[0]) : setActiveCategory('');
    if (location.country?.uuid) setSelCountry(location.country?.uuid)
    if (location.state?.uuid) setSelState(location.state?.uuid)
    if (location.county?.uuid) setSelCounty(location.county?.uuid)
    if (location.city?.uuid) setSelCity(changeCity === true ? selectedCity : location.city?.uuid)
  }, [location])

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
    if (selBrand?.length >= 0 && JSON.stringify(selBrand) !== "[null]") {

      const find = barndList?.find((item) => item?.uuid === selBrand[0])
      if (find?.uuid) {
        onBrandSelect(true, find?.uuid)
        let key = Math.random();
        setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
      }
      else {
        onBrandSelect(true, barndList[0]?.uuid)
        let key = Math.random();
        setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
      }

    }
    else {
      onBrandSelect(true, barndList[0]?.uuid)
    }
  }, [barndList])

  useEffect(() => {
    if (selCategory?.uuid) {
      let key = Math.random();
      setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
    }
  }, [selCategory, selBrand])

  const onLoad = () => {

    setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
    // setSubCatPayload(`search=`);
    // setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(selBrand)?`&brand_uuid=${selBrand}`:''}`);

    setPayload(`page_name=home`);
    // setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(activeBrand)?`&brand_uuid=${activeBrand}`:''}`);
    let key = Math.random();
    setCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&city_uuid=${selCity}`);
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
  }, [selCountry, selState, selCounty, selCity, selectedCity, changeCity]);

  useEffect(() => {
    // if(actBrand !="" && selCategory?.uuid){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }else if(selCategory?.uuid  && actBrand == ""){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }
    if (selCategory?.uuid) {
      setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand) ? `&brand_uuid=${actBrand}` : ''}`);
    }
  }, [selCategory, actBrand, selCity])
  useEffect(() => {
    setSubCatBrand(selBrand);

    if (selBrand != "") {
      let key = Math.random();
      setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
    }
  }, [selBrand])

  useEffect(() => {
    if (changeCity === true) {
      let key = Math.random();
      if (seen === false) {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=`)
      }
      else {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=no`)
      }
      // setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=${seen === false ? '' : 'no'}`)
    }
    else {
      let key = Math.random();
      if (seen === false) {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=`)
      }
      else {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=no`)
      }
      // setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=${seen === false ? '' : 'no'}&type=filter`)
    }

  }, [selBrand, subCatActive, setUpdateBrandFav, setUpdateMailFav, seen, selCity])
  // useFocusEffect(useCallback(()=>{
  //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
  //   barndList.map((it)=>{
  //     if(it.uuid == 'ST-039AAD12'){
  //     }
  //  })
  // },[])
  // )

  useEffect(() => {
    if (subCategoryList) {
      const isEven = (value) => value.is_mail_available === "true";

      const checkMail = subCategoryList.filter(isEven);

      if (checkMail?.length > 0) {
        let indexValue = 0;
        subCategoryList && subCategoryList.find((val, undex) => {
          if (val.is_mail_available === "true" && indexValue === 0) {

            indexValue = indexValue + 1
            onTabChane(val?.uuid);
            setSubCatActive(val?.uuid || subCategoryList[0].uuid);
            setTabindexs(undex)

            // const defPayload = `country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}`;
            // setMailPayload(selBrand.length > 0 ? selCategory ? `${defPayload}&category_uuid=${selCategory?.uuid}&brand_uuid=${selBrand}&sub_category_uuid=${val?.uuid || subCategoryList[0].uuid}` : `${defPayload}&brand_uuid=${selBrand}&sub_category_uuid=${val?.uuid || subCategoryList[0].uuid}` : `${defPayload}&sub_category_uuid=${val?.uuid || subCategoryList[0].uuid}&category_uuid=${selCategory?.uuid}`);
          }
        });
      }
      else {
        let data = subCategoryList.filter(item => item?.mails_count > 0)
        if (data?.length > 0 && subCheck === false) {
          setSubCatActive(data[0]?.uuid)

        } else if (subCategoryList?.length > 0) {
          if (changeCity === false && subCheck === false) {
            setSubCatActive(subCategoryList[0].uuid);
            setTabindexs(0);
          }
        }

        // const defPayload = `country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}`;
        //   setMailPayload(selBrand.length > 0 ? selCategory ? `${defPayload}&category_uuid=${selCategory?.uuid}&brand_uuid=${selBrand}&sub_category_uuid=${subCategoryList[0].uuid}` : `${defPayload}&brand_uuid=${selBrand}&sub_category_uuid=${subCategoryList[0].uuid}` : `${defPayload}&sub_category_uuid=${subCategoryList[0].uuid}&category_uuid=${selCategory?.uuid}`);
      }
    }
    // if (subCategoryList) {
    //   const active = subCategoryList && subCategoryList.find((val) => val.sort_order === 1);
    //   setSubCatActive(active?.uuid || subCategoryList[0].uuid);
    // }
  }, [subCategoryList, selBrand, selCategory])


  const onTabChane = (sub_category_uuid) => {
    const value = subCategoryList?.[sub_category_uuid]?.uuid;
    setSubCatActive(value);
    setSubCheck(true);
    if (changeCity === true) {
      let key = Math.random();
      if (seen === false) {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCategoryList[sub_category_uuid]?.uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=`)
      }
      else {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCategoryList[sub_category_uuid]?.uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=no`)
      }
      // setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCategoryList[sub_category_uuid]?.uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&type=filter&search=&pagenum=&limit=&seen=${seen === false ? '' : 'no'}`)
    }
    else {
      if (seen === false) {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCategoryList[sub_category_uuid]?.uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=`)
      }
      else {
        setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCategoryList[sub_category_uuid]?.uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}&seen=no`)
      }
      let key = Math.random();
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
    requestMailHtml(item);
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
    }
    else {
      setSubCheck(true);
    }
    setActiveCategory(val)
    setSelCategory(val);
    // setSelBrand([])
  }

  //   useEffect(()=>{
  //     setInterval(()=>{
  //         let key = Math.random();
  //         alert(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`)
  //         setBrandPayload(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);

  //     },30000)
  //   },[])


  const onBrandSelect = (e, brandId) => {
    const brandList = [...selBrand];
    const brand = e ? [brandId] : selBrand.filter((el) => el !== brandId);
    const isExist = selBrand[0] === brandId ? true : false;
    setSelBrand([...brand]);
    setActiveBrand(brandId)
    if (!isExist) {
      setSubCheck(false);
    }
    else {
      setSubCheck(true);

    }
  }

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const requestMailHtml = (item) => {
    if (!item?.mime_type) return;

    if (item.mime_type === 'text/html') {
      // Prefer explicit html_url if available, otherwise try to derive from image_url
      const htmlFile = item?.html_url || (item?.image_url ? item.image_url.split('/').slice(-1)[0] : null);
      if (htmlFile) {
        setMailURL({ html_url: htmlFile });
      } else {
        // Clear any previous html URL if none found for this item
        setMailURL("");
      }
    }
  };

  const isHtmlOffer = offerCard?.mime_type === 'text/html';
  const isPdfOffer = offerCard?.mime_type === 'application/pdf';
  const isImageOffer = offerCard?.mime_type?.startsWith('image/');
  const isVideoOffer = Boolean(offerCard?.video_url);

  const renderOfferMedia = () => {
    if (isVideoOffer) {
      return (
        <WebView
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          source={{
            uri: `${offerCard?.video_url}?controls=0&showinfo=0&wmode=transparent&rel=0&mode=opaque`,
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: screenWidth - 10,
            minHeight: '40%',
          }}
        />
      );
    }

    if (isHtmlOffer) {
      if (!mailHTML) {
        return <ActivityIndicator size="small" color="#4EA838" />;
      }
      return (
        <WebView
          source={{ html: mailHTML }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: screenWidth - 10,
            minHeight: '40%',
          }}
        />
      );
    }

    if (isPdfOffer) {
      return (
        <Pdf
          source={{
            uri: offerCard?.image_url,
            cache: true,
          }}
          trustAllCerts={false}
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
        />
      );
    }

    if (isImageOffer && offerCard?.image_url) {
      return (
        <Image
          resizeMode="contain"
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          source={{ uri: `${offerCard?.image_url}` }}
        />
      );
    }

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
        <Text style={{ color: '#304B2F', fontSize: 14 }}>No preview available for this mail.</Text>
      </View>
    );
  };

  const onUnsubscribeMail = () => {
    if (!offerCard?.uuid) return;
    Alert.alert(
      'Unsubscribe',
      'Do you want to stop receiving this mail?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: () => {
            setUnsubscribeMail({
              user_uuid: userDetails?.uuid,
              mail_uuid: offerCard?.uuid,
            });
          },
        },
      ],
    );
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
          <TouchableOpacity
            onPress={onUnsubscribeMail}
            style={{ alignSelf: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 8 }}
          >
            <Text style={{ color: '#B91C1C', fontSize: 12 }}>Unsubscribe</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>{renderOfferMedia()}</View>
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
          <TouchableOpacity
            onPress={onUnsubscribeMail}
            style={{ alignSelf: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 8 }}
          >
            <Text style={{ color: '#B91C1C', fontSize: 12 }}>Unsubscribe</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>{renderOfferMedia()}</View>
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
      requestMailHtml(item);
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
      requestMailHtml(item);
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
        console.log(res?.data?.data, "data?.data")
        if (res?.data?.data?.pop_up === false) {
          openModal();
        }
        else if (res?.data?.data?.pop_up === true) {
          closeModal();
        }
      })
      .catch((err) => {
        closeModal();
      });
  };

  const [addlistData, setaddlistData] = useState([])
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
    <View
      style={{
        height: 218,
        backgroundColor: "#B3C680",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12
      }}
    >
      {/* <Text style={{ color: "#fff", fontSize: 20 }}>Color: {item}</Text> */}
      <Image source={{ uri: item?.image }} alt={item?.name}></Image>
    </View>
  );

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


  return (
    <View style={{ flex: 1 }}>
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
          <View style={{ flexDirection: 'row', justifyContent: "center", margin: 5 }}>
            {(categoryList?.length > 0 && !changeCat) && (
              <View style={styless.autocompleteContainer}>
                {/* iOS Platform Autocomplete */}
                {Platform.OS === 'ios' && (
                  <AutocompleteDropdown
                    direction={Platform.select({ ios: 'down' })}
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    initialValue={selCategory?.value}
                    flatListProps={{ nestedScrollEnabled: true }}
                    onSelectItem={(val) => onChangeCategoryHandler(val)}
                    dataSet={categoryList}
                    containerStyle={{
                      flexGrow: 1,
                      flexShrink: 1,
                      zIndex: 999,
                    }}
                    textInputProps={{
                      placeholder: 'Select category',
                      style: {
                        color: '#383b42',
                      },
                    }}
                    inputContainerStyle={{
                      marginTop: 5,
                      backgroundColor: '#fff',
                      borderColor: '#bbb',
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  />
                )}

                {/* Android Platform Dropdown */}
                {Platform.OS === 'android' && (
                  // selCategory?.value ?
                  <Dropdown
                    style={[
                      styles.dropdown,

                      isFocus && { borderColor: 'black' },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={{ color: 'black' }}
                    iconStyle={styles.iconStyle}
                    data={categoryList}
                    search
                    maxHeight={300}
                    labelField="title"
                    valueField={selCategory?.value ? "value" : "uuid"}
                    placeholder={!isFocus ? 'Select Category' : '...'}
                    searchPlaceholder="Search..."
                    value={selCategory?.value ? selCategory?.value : selCategory?.uuid}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      onChangeCategoryHandler(item);
                      setIsFocus(false);
                    }}
                  />
                  //   :
                  //   <Dropdown
                  //   style={[
                  //     styles.dropdown,

                  //     isFocus && { borderColor: 'black' },
                  //   ]}
                  //   placeholderStyle={styles.placeholderStyle}
                  //   selectedTextStyle={styles.selectedTextStyle}
                  //   inputSearchStyle={styles.inputSearchStyle}
                  //   itemTextStyle={{ color: 'black' }}
                  //   iconStyle={styles.iconStyle}
                  //   data={categoryList}
                  //   search
                  //   maxHeight={300}
                  //   labelField="title"
                  //   valueField="uuid"
                  //   placeholder={!isFocus ? 'Select Category' : '...'}
                  //   searchPlaceholder="Search..."
                  //   value={selCategory?.uuid || categoryList[0]}
                  //   onFocus={() => setIsFocus(true)}
                  //   onBlur={() => setIsFocus(false)}
                  //   onChange={(item) => {
                  //     onChangeCategoryHandler(item);
                  //     setIsFocus(false);
                  //   }}
                  // />

                )}
              </View>
            )}


            <View style={styless.autocompleteContainer}>
              {/* iOS Autocomplete Dropdown */}
              {Platform.OS === 'ios' && (
                <AutocompleteDropdown
                  direction={Platform.select({ ios: 'down' })}
                  clearOnFocus={false}
                  closeOnBlur={true}
                  closeOnSubmit={false}
                  initialValue={HandleValue[0] || []}
                  flatListProps={{ nestedScrollEnabled: true }}
                  onSelectItem={(val) => handleSelectCity(val)}
                  dataSet={HandleValue}
                  containerStyle={{
                    flexGrow: 1,
                    flexShrink: 1,
                    zIndex: 999,
                  }}
                  textInputProps={{
                    placeholder: 'Select city',
                    style: {
                      color: '#383b42',
                    },
                  }}
                  inputContainerStyle={{
                    marginTop: 5,
                    backgroundColor: '#fff',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                />
              )}

              {/* Android Dropdown */}
              {Platform.OS === 'android' && (
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: 'black' },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{ color: 'black' }}
                  iconStyle={styles.iconStyle}
                  data={getCityFormattedData(HandleValue)}
                  search
                  maxHeight={300}
                  labelField="label"  // Use "label" for dropdown text
                  valueField="value"  // Use "value" for the actual selected value
                  placeholder={!isFocus ? 'Select city' : '...'}
                  searchPlaceholder="Search..."
                  value={cityName}  // Set the currently selected city
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    // setSelectedCity(item.label);  // Set the selected city UUID
                    setIsFocus(false);
                    handleSelectCity(item);  // Call your custom handler if needed
                  }}
                />
              )}
            </View>

          </View>


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

            {barndList?.length >= 1 && (
              <FlatList
                data={barndList}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.brandListContent}
                keyExtractor={(item) => item?.uuid || String(item?.id)}
                renderItem={({ item, index }) => (
                  <View style={styles.brandListItem} key={item?.uuid}>
                    <BrandIconCard
                      isActive={selBrand?.indexOf(item?.uuid) !== -1 || item?.is_highlight === 'true'}
                      item={item}
                      rounded
                      isFavourite={item?.is_faviourate === 'true'}
                      color={'#fff'}
                      containerStyles={{}}
                      onFavouriteToggle={() => onFavouriteToggle(item?.uuid)}
                      onBrandSelect={(e) => onBrandSelect(e, item?.uuid)}
                      src={item?.logo_url}
                      onActionPress={() => console.log('0000')}
                      showAddress={true}
                      showActionByDefault={true}
                      size={110}
                    />
                  </View>
                )}
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={120}
              />
            )}

            {(barndList.length == 0 && !isBrandLoading) && <Text style={{ fontSize: 20 }}>Coming Soon...</Text>}

          </View>
          {brandCount > 0 && <View style={{ marginTop: -20, paddingRight: 5, width: '100%', display: 'flex', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Store')}>
              <EntypoIcon
                name="arrow-right"
                size={22}
                style={styles.favIcon}
              />
            </TouchableOpacity>
          </View>}

        </View>

        {subCategoryList && subCategoryList.length && <TabView
          tabs={subCategoryList}
          actTab={subCatActive}
          subCheck={subCheck}
          onTabChange={(index) => onTabChane(index)}
          tabContentBaseStyles={{
            paddingBottom: barndList?.length > 2 ? 100 : 20,
          }}
          renderActiveTabContent={() => (
            <>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={seen ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={seen}
                style={{
                  justifyContent: 'flex-start',
                  alignSelf: 'flex-start',
                  display: 'flex'
                }}
              />
              <ScrollView >
                <View style={styles.tabContent}>

                  {mailList?.length > 0 && mailList?.map((_item, idx) => {
                    let j = idx % 4;
                    return (
                      <OfferCard
                        containerStyles={{
                          marginBottom: idx + 1 < mailList?.length ? 10 : 0,
                          backgroundColor: colors[j]
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
              {mailCount > 0 && !isMailLoading && <View style={{ marginTop: -20, width: '100%', display: 'flex', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('Mails', { category_uuid: selCategory?.uuid, sub_cat_uuid: subCatActive, brand_uuid: selBrand })}>
                      <EntypoIcon
                        name="arrow-right"
                        size={22}
                        style={styles.favIcon}
                      />
                    </TouchableOpacity> */}
              </View>}
              {
                (mailList.length == 0 && !isMailLoading) && <Text style={{ fontSize: 20 }}>No Results Found...</Text>
              }
              {/* {
                  isMailLoading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                } */}
            </>
          )}
        />}
      </ScrollView>

    </View>
  );
};

const styless = StyleSheet.create({
  autocompleteContainer: {
    // flex: 1,
    left: 0,
    // position: 'absolute',
    paddingHorizontal: 8,
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
