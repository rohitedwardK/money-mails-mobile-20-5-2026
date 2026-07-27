import React, { useState, useEffect, useContext, useCallback,useLayoutEffect} from 'react';
import { Image,ActivityIndicator, ScrollView, Text, View, TouchableOpacity,StyleSheet, Platform,Button} from 'react-native';
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
import getColors from '../../../utils/colors';
import { useRoute } from '@react-navigation/native';
import {BackHandler} from 'react-native';
import { useFocusEffect } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-element-dropdown';


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
  const { userDetails, location,activeBrand, setActiveCategory,activeCategory } = useContext(UserContext);
  const { screenWidth } = useContext(DeviceContext);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerContentRoute, setDrawerContentRoute] = useState("search");
  const offerDetailsCardRef = (null);
  const { data, isLoading, error, setPayload } = useHome();
  const { barndList, brandCount, isBrandLoading, brandError, setBrandPayload, setUpdateBrandFav } = useBrand();
  const { categoryList, isCatLoading, catError, setCatPayload, setData } = useCategory();
  const { subCategoryList = [], setSubCatPayload,setSubCatBrand } = useSubCategory();
  const { mailList,isMailLoading, mailCount, isRedeem, redeemMessage,redeemSuccessMessage, redeemError, mailHTML, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL } = useMail();
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
  const [tabIndexs,setTabindexs] = useState(0);
  const [timerShow, setTimerShow] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  const { setModalDetails } = useContext(ModalContext);

  const [changeCat, setChangeCat] = useState(false);
  
  useEffect(() => {
    // back handle exit app
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
}, []);

const backButtonHandler = () => {

  let backHandlerClickCount;
  backHandlerClickCount += 1;
  if(route.name == 'Home'){
    
    BackHandler.exitApp();
  }
  setTimeout(() => {
      backHandlerClickCount = 0;
  }, 1000);
  
  return true;
}

  useLayoutEffect(()=>{
    setChangeCat(false);
  },)


 
  useEffect(()=>{
      if(route.params != undefined){
        if(route.params.category_uuid != undefined && route.params.brand_uuid !=undefined){
          if(route.params.category_uuid && route.params.brand_uuid && route.params.sub_category_uuid){
            categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid), 1)[0]);
            // alert(route.params.brand_uuid)
            setChangeCat(true)
            setSubCatActive(route.params.sub_category_uuid)
            setActBrand(route.params.brand_uuid);
          }else{
           
            setCatPayload(`search=&user_uuid=${userDetails?.uuid}`);
            categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid.uuid), 1)[0]);
            setSelCategory(categoryList[0]);
            setActiveCategory(categoryList[0]);
            setChangeCat(true)
            setActBrand(route.params.brand_uuid);
          }
          
        }else if(route.params.brand_uuid != undefined){
          setActBrand(route.params.brand_uuid);
              setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&brand_uuid=${route.params.brand_uuid}`);

        }else if (route.params.category_uuid != undefined){
          categoryList.unshift(categoryList.splice(categoryList.findIndex(elt => elt.uuid === route.params.category_uuid.uuid), 1)[0]);
          setSelCategory(categoryList[0]);
          setActiveCategory(categoryList[0]);
          
          setChangeCat(true)
        }
      }
  },[route.params])
  // useFocusEffect(useCallback(()=>{
  //   let key = Math.random();
  //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&brand_uuid=${actBrand}&key=${key}`);
  // },[]))

  useEffect(()=>{
    if(seconds==0){
      if(redeemSuccessMessage !=""){
        onLoad();
        let key = Math.random();
        setBrandPayload(`key=${key}&pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
        Toast.show(redeemSuccessMessage, Toast.LONG, {
          backgroundColor: '#45B39D',
        })
      }
    }
  },[seconds])


  

  const { start, stop,setTimer } = useInterval(count => {
    
    setSeconds(count);
    if (count === 18) {
      setSeconds(0);
      setRedeemedOfferIndexes([...redeemedOfferIndexes, selectedOfferIndex]);
      setSelectedOfferIndex();
      // setIsOfferClicked(false);
      
      if(offerCard?.type=='paid' && offerCard?.is_seen != 'true'){
        
        // setModalDetails({
        //   modalType: 'dialog',
        //   isOpen: true,
        //   modalContent: (
        //     <RedeemModalContent
        //       points= {redeemSuccessMessage}
        //       totalAmount={userDetails?.rewards?.point}
        //       onActionClick={() => setModalDetails({})}
        //     />
        //   ),
        //   modalStyles: {
        //     containerStyles: {
        //       alignItems: 'center',
        //     },
        //     contentStyles: {
        //       alignItems: 'center',
        //     },
        //   },
        //   actions: [],
        // });
      }
      
      stop();
    }
  });

  const styles = homeScreenStyles();

  const isOfferContentDrawerActive = drawerContentRoute === "offerCard";

  useEffect(() => {
    setSelCountry(userDetails?.address?.country || userDetails?.country);
    setSelState(userDetails?.address?.state || userDetails?.state);
    setSelCounty(userDetails?.address?.county || userDetails?.county);
    setSelCity(userDetails?.address?.city || userDetails?.city);
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
      setSelCity(userDetails?.address?.city);
    }
  }, [userDetails?.address])

  useEffect(()=>{
    if(categoryList?.length > 0) setSelCategory(categoryList[0]);
    (categoryList?.length > 0)?setActiveCategory(categoryList[0]):setActiveCategory('');
    if(location.country?.uuid) setSelCountry(location.country?.uuid)
    if(location.state?.uuid) setSelState(location.state?.uuid)
    if(location.county?.uuid) setSelCounty(location.county?.uuid)
    if(location.city?.uuid) setSelCity(location.city?.uuid)
  },[location])

  useEffect(() => {
    onBrandSelect(true, barndList[0]?.uuid)
  },[barndList])
  const onLoad = () => {
    setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
    // setSubCatPayload(`search=`);
    // setSubCatPayload(`search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(selBrand)?`&brand_uuid=${selBrand}`:''}`);

    setPayload(`page_name=home`);
    // setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(activeBrand)?`&brand_uuid=${activeBrand}`:''}`);
    setCatPayload(`search=&user_uuid=${userDetails?.uuid}`);
    
    setCountry(`page=0&limit=10&search=United States`);
    // if (subCatActive && (selCountry || selState || selCounty || selCity)) setMailPayload(`country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&type=filter&}&brand_uuid=${selBrand}`)
  }


  useEffect(()=>{
    if(categoryList?.length > 0){
      setSelCategory(categoryList[0])
    // alert(categoryList)
    }
  },[categoryList])

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
  }, [ selCountry, selState, selCounty, selCity]);

  useEffect(()=>{
    // if(actBrand !="" && selCategory?.uuid){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }else if(selCategory?.uuid  && actBrand == ""){
    //   setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    // }
    if(selCategory?.uuid){
      setBrandPayload(`pagenum=0&limit=6&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}${(actBrand)?`&brand_uuid=${actBrand}`:''}`);
    }
  },[selCategory,actBrand])
  useEffect(()=>{
    setSubCatBrand(selBrand);
    
    if(selBrand !=""){
      let key = Math.random();
      setSubCatPayload(`key=${key}&search=&user_uuid=${userDetails?.uuid}&category_uuid=${selCategory?.uuid}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}`);
    }
  },[selBrand])

  useEffect(()=>{
    // setSubCatPayload("search=")
    // if(selBrand != ""){
      // alert(subCatActive)

      let key = Math.random();
      setMailPayload(`&key=${key}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&sub_category_uuid=${subCatActive}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}&brand_uuid=${selBrand}&category_uuid=${selCategory?.uuid}`)
    // }

  },[selBrand,subCatActive,setUpdateBrandFav,setUpdateMailFav])
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

      if(checkMail?.length > 0) {
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
      else{
            let data = subCategoryList.filter(item=> item?.mails_count > 0)
            if(data){
              setSubCatActive(data[0]?.uuid)
            }else{
              setSubCatActive(subCategoryList[0].uuid);
              setTabindexs(0)
            }
          
        // const defPayload = `country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&user_uuid=${userDetails?.uuid}&county_uuid=${selCounty}`;
        //   setMailPayload(selBrand.length > 0 ? selCategory ? `${defPayload}&category_uuid=${selCategory?.uuid}&brand_uuid=${selBrand}&sub_category_uuid=${subCategoryList[0].uuid}` : `${defPayload}&brand_uuid=${selBrand}&sub_category_uuid=${subCategoryList[0].uuid}` : `${defPayload}&sub_category_uuid=${subCategoryList[0].uuid}&category_uuid=${selCategory?.uuid}`);
      }
    }
    // if (subCategoryList) {
    //   const active = subCategoryList && subCategoryList.find((val) => val.sort_order === 1);
    //   setSubCatActive(active?.uuid || subCategoryList[0].uuid);
    // }
  }, [subCategoryList,selBrand,setSelBrand])

 

  

  const onTabChane = (sub_category_uuid) => {
    const value = subCategoryList[sub_category_uuid]?.uuid;
    setSubCatActive(value);
  };

  

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



  const onChangeCategoryHandler = async(val) => {
    if(!val) return;
    const isExist = selCategory === val ? true : false;
    setActiveCategory(val)
    setSelCategory(val);
    if(!isExist){
      setActBrand("");
    }
    
  }

  const onBrandSelect = (e, brandId) => {
    const brandList = [...selBrand];
    const brand = e ? [brandId] : selBrand.filter((el) => el !== brandId);
    setSelBrand([...brand]);
  }

  const getOfferDetailsContent = () => (
    <>
    <View style={{backgroundColor : "#FFFFFF",flex:1,minWidth: screenWidth - 10}}>
      
      <View>
      <View style={styles.timerContainer}>
        {/* <Text style={styles.secondsCounter}>{18 - seconds}</Text> */}
        {seconds >0&&<View style={{alignItems:'center'}}><Text style={{fontSize:18}}>Please Wait...</Text></View>}
        {seconds==0&&<TouchableOpacity onPress={closeAdd} style={{
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
      <View style={{alignItems:'center'}}>
        <Text style={{ color: '#fff', fontSize: 18, padding: 5 }}>{offerCard?.message}</Text>
      </View>
        {(offerCard?.mime_type === 'text/html' && offerCard?.image_url) && <View style={{ flex: 1 }}><WebView
          source={{
            html : mailHTML
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
        {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') && <View style={{alignItems:'center'}}>
        <Image
          resizeMode="contain"
          style={{ width: 200, height: 200 }}
          source={{ uri: `${offerCard?.image_url}` }}
        />
          </View>}
      </View>
      </View>
    </>
  );

  const closeAdd = () =>{
    setSeconds(18);
    setIsOfferClicked(false);
    setTimer(0);
    stop();
    setModalDetails({})
  }

  const getOfferDetailsContentWithoutTimer = () => (
    <>
     

<View style={{backgroundColor : "#FFFFFF",flex:1,minWidth: screenWidth - 10}}>
      
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
      <View style={{alignItems:'center'}}>
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
        <View style={{alignItems:'center'}}>
          <Image
          resizeMode="contain"
          style={{ width: 200, height: 200 }}
          source={{ uri: `${offerCard?.image_url}` }}
        />
          </View>
        }
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
        modalContent: (offerCard?.type == 'paid' && offerCard?.is_seen == 'false') ? getOfferDetailsContent():getOfferDetailsContentWithoutTimer(),
        modalStyles: {
          containerStyles: {
            alignItems: 'center',
            marginTop : 0
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
    else{
      setTimerShow(false);
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
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
  };

  return (
    <>
      
        {/* {data?.length > 0 && <OffersCarousal data={data} />} */}
       
        
        <ScrollView style={styles.pageContainer} nestedScrollEnabled={true}>
        {(categoryList?.length > 0 && !changeCat) && <View style={styless.autocompleteContainer}>
          {Platform.OS ==='ios' &&<AutocompleteDropdown
            direction={Platform?.select({ ios: 'down' })}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            initialValue= {categoryList[0]}
            flatListProps={{ nestedScrollEnabled: true, }}
            onSelectItem={val => onChangeCategoryHandler(val)}
            dataSet={categoryList}
            containerStyle={{ flexGrow: 1, flexShrink: 1,zIndex : 999 }}
            textInputProps={{
              placeholder: 'select category',
              style : {
                color : '#383b42',
                // zIndex : -5
              }
            }}
            inputContainerStyle={{
              marginTop: 5,
              backgroundColor: '#fff',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
              // zIndex : -5
            }}
          />}
          
          {
            Platform.OS === 'android' &&<Dropdown
            style={[styles.dropdown,{width:'100%'}, isFocus && { borderColor: 'black' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle ={{color:'black'}}
            iconStyle={styles.iconStyle}
            data={categoryList}
            search
            maxHeight={300}
            labelField="title"
            valueField="value"
            placeholder={!isFocus ? 'Select Category' : '...'}
            searchPlaceholder="Search..."
            value={categoryList[0]}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                // setValue(item.value);
                onChangeCategoryHandler(item)
                setIsFocus(false);
            }}
            
            />
          }
        </View>}
        <View style={styles.brandIconCardsWrapper}>
          {barndList && !isBrandLoading && barndList?.map((item, i) => {
            return (<View style={{ marginVertical: 5 }} key={i}>
              <BrandIconCard
              isActive={selBrand?.indexOf(item?.uuid)!==-1|| item?.is_highlight==='true'?true:false}
              key={i}
              item={item}
              rounded
              isFavourite={item?.is_faviourate === 'true' ? true : false}
              color={'#fff'}
              containerStyles={{
                marginBottom: i + 1 < barndList?.length ? 20 : 0,
              }}
              onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid)}
              onBrandSelect={(e) => onBrandSelect(e, item?.uuid)}
              src={item?.logo_url}
              showAddress={true}
              onActionPress={() => console.log('0000')}
              size={110}>
            </BrandIconCard>
            </View>
            )
          })}
          {
            (barndList.length == 0 && !isBrandLoading) &&<Text style={{fontSize:20}}>Coming Soon...</Text>
          }
          {
            isBrandLoading && <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
          }
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
       
        {subCategoryList && subCategoryList.length && <TabView
          tabs={subCategoryList}
          actTab = {subCatActive}
          onTabChange={onTabChane}
          tabContentBaseStyles={{
            marginBottom: 100,
          }}
          renderActiveTabContent={() => (
            <>
              <View style={styles.tabContent}>
                {mailList.map((_item, idx) => {
                  let j = idx % 4;
                  return (<OfferCard
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
                  />)
                })}
              </View>
              {mailCount > 0 &&!isMailLoading && <View style={{ marginTop: -20, width: '100%', display: 'flex', alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Mails',{category_uuid:selCategory?.uuid, sub_cat_uuid:subCatActive,brand_uuid:selBrand})}>
                  <EntypoIcon
                    name="arrow-right"
                    size={22}
                    style={styles.favIcon}
                  />
                </TouchableOpacity>
              </View>}
              {
                (mailList.length == 0 && !isMailLoading) && <Text style={{fontSize:20}}>No Results Found...</Text>
              }
              {
                isMailLoading && <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
              }
            </>
          )}
        />}
      </ScrollView>
    </>
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
  }
});

export default Home;