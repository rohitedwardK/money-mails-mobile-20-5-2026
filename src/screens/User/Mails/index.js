import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TextInput, Image, ActivityIndicator, FlatList, TouchableHighlight, TouchableOpacity, Platform} from 'react-native';
import OfferCard from '../../../components/organisms/OfferCard';
import { WebView } from 'react-native-webview';
import {categoryPageStyles} from './index.style';
import getColors from '../../../utils/colors';
import {DeviceContext} from '../../../context/DeviceContext';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useMail } from "../../../hooks/services/useMail";
import { useMailPage } from '../../../hooks/services/useMailPage';
import { UserContext } from "../../../context/UserContext";
import { useSubCategory } from "../../../hooks/services/useSubCategory";
import { useInterval } from '../../../hooks/useInterval';
import { useRoute } from '@react-navigation/native';
import { ModalContext } from '../../../context/ModalContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import RedeemModalContent from '../Home/RedeemModalContent';
import { styles as homeScreenStyles } from '../Home/index.style';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const hasHtmlTags = value => /<\/?[a-z][\s\S]*>/i.test(String(value || ''));

const buildHtmlDocument = (html, textColor = '#111827') => `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          color: ${textColor};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 16px;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }
        img, video, iframe {
          max-width: 100%;
          height: auto;
        }
        table {
          max-width: 100%;
        }
      </style>
    </head>
    <body>${html || ''}</body>
  </html>
`;

const getAddressFilters = userDetails => {
  const address = userDetails?.address || {};

  return {
    country: address.country || userDetails?.country_uuid || userDetails?.country || '',
    state: address.state || userDetails?.state_uuid || userDetails?.state || '',
    county: address.county || userDetails?.county_uuid || userDetails?.county || '',
    city: address.city || userDetails?.city_uuid || userDetails?.city || '',
  };
};

const buildMailPagePayload = ({
  pageNum,
  PageSize,
  userDetails,
  catuid,
  branduid,
  subCatuid,
  key,
}) => {
  const filters = getAddressFilters(userDetails);
  const keyParam = key ? `key=${key}&` : '';

  if (!userDetails?.uuid || !filters.country || !filters.city || !catuid) {
    return '';
  }

  return `${keyParam}pagenum=${pageNum}&limit=${PageSize}&country_uuid=${filters.country}&state_uuid=${filters.state}&city_uuid=${filters.city}&category_uuid=${catuid}&brand_uuid=${branduid}&sub_category_uuid=${subCatuid}&user_uuid=${userDetails?.uuid}&county_uuid=${filters.county}`;
};

const Mails = () => {
  const [pageNum, setPageNum] = useState(1);
  const [PageSize, setPageSize] = useState(15);
  const stylesTimer = homeScreenStyles();
  const route = useRoute();
  const {themeColors: colors, isDarkMode, offerCardColors} = getColors();
  const {screenWidth} = useContext(DeviceContext);
  const { userDetails } = useContext(UserContext);
  const styles = categoryPageStyles();
  const { mailList = [], mailCount, isRedeem, redeemMessage, redeemError,redeemSuccessMessage, mailHTML, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL} = useMail();
  const { mailPageData, setMailPagePayload, setPage } = useMailPage();
  const { subCategoryList = [], setSubCatPayload } = useSubCategory();
  const [currentPage, setCurrentPage] = useState(1);
  const [catuid, setCatuid] = useState("")
  const [subCatuid, setSubCatuid] = useState("")
  const [branduid, setBranduid] = useState("")

  const [filterValue, setFilterValue] = useState('');
  const [redeemedOfferIndexes, setRedeemedOfferIndexes] = useState([]);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState();
  const [isOfferClicked, setIsOfferClicked] = useState(false);
  const [offerCard, setOfferCard] = useState({});
  const [seconds, setSeconds] = useState(0);
  const { setModalDetails } = useContext(ModalContext);
  const isFocused = useIsFocused();

  useEffect(()=>{
    if (userDetails?.uuid) {
      setSubCatPayload(`search=&user_uuid=${userDetails.uuid}`);
    }
  },[setSubCatPayload, userDetails?.uuid])

  useEffect(()=>{
    
      if(route.params != undefined){
        setPage(pageNum)
        setCatuid(route.params.category_uuid)
        setBranduid(route.params.brand_uuid)
        setSubCatuid(route.params.sub_cat_uuid)
        const nextPayload = buildMailPagePayload({
          pageNum,
          PageSize,
          userDetails,
          catuid: route.params.category_uuid,
          branduid: route.params.brand_uuid,
          subCatuid: route.params.sub_cat_uuid,
        });
        if(nextPayload)setMailPagePayload(nextPayload);

      }
  },[route.params,isFocused])

  useEffect(()=>{
    setPage(pageNum)
    const nextPayload = buildMailPagePayload({
      pageNum,
      PageSize,
      userDetails,
      catuid,
      branduid,
      subCatuid,
    });
    if(nextPayload)setMailPagePayload(nextPayload);
  },[userDetails, subCategoryList,branduid,isFocused,pageNum])

  const loadMoreData = () => {
    const nextPayload = buildMailPagePayload({
      pageNum,
      PageSize,
      userDetails,
      catuid,
      branduid,
      subCatuid,
    });
    if(nextPayload)setMailPagePayload(nextPayload);
  }

  const onFavouriteMailToggle = (mail_uuid) => {
    setUpdateMailFav({
      user_uuid : userDetails?.uuid,
      mail_uuid : mail_uuid
      });
  }

  const renderHtmlBlock = (html, {textColor = '#111827', minHeight = 40} = {}) => (
    <WebView
      originWhitelist={['*']}
      source={{html: buildHtmlDocument(html, textColor)}}
      style={{
        width: screenWidth - 24,
        minHeight,
        backgroundColor: 'transparent',
      }}
      containerStyle={{
        backgroundColor: 'transparent',
      }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderMailMessage = textColor => {
    const message = offerCard?.message || '';
    if (!message) return null;

    return (
      <View style={{alignItems: 'center', width: '100%', padding: 5}}>
        {hasHtmlTags(message) ? (
          renderHtmlBlock(message, {textColor, minHeight: 56})
        ) : (
          <Text style={{color: textColor, fontSize: 18, textAlign: 'center'}}>
            {message}
          </Text>
        )}
      </View>
    );
  };

  const renderMailHtml = () => {
    if (offerCard?.mime_type !== 'text/html' || !offerCard?.image_url) return null;

    return (
      <View style={{flex: 1, width: '100%'}}>
        <WebView
          originWhitelist={['*']}
          source={{html: buildHtmlDocument(mailHTML)}}
          style={{
            flex: 1,
            minWidth: screenWidth - 10,
            minHeight: 360,
            backgroundColor: '#fff',
          }}
          showsVerticalScrollIndicator
        />
      </View>
    );
  };

  useEffect(()=>{
    if(seconds==0){
      if(redeemSuccessMessage !=""){
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

  const getOfferDetailsContent = () => (
    <>
    <View style={{backgroundColor : "#FFFFFF",flex:1,minWidth: screenWidth - 10}}>
      
      <View>
      <View style={styles.timerContainer}>
        {/* <Text style={styles.secondsCounter}>{18 - seconds}</Text> */}
        {seconds >0&&<View style={{alignItems:'center'}}><Text style={{fontSize:18}}>Please Wait...</Text></View>}
        {seconds==0&&<View style={{width:40,justifyContent:'flex-start'}}><TouchableOpacity onPress={closeAdd} style={{
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
      }
      </View>
      {renderMailMessage('#fff')}
        {renderMailHtml()}
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
    setPage(1)
    let key = Math.random();
    const nextPayload = buildMailPagePayload({
      key,
      pageNum: 1,
      PageSize,
      userDetails,
      catuid,
      branduid,
      subCatuid,
    });
    if(nextPayload)setMailPagePayload(nextPayload);
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
              width : 40
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
      {renderMailMessage('#000000')}
     
        {renderMailHtml()}
        {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') && <View style={{alignItems:'center'}}><Image
          resizeMode="contain"
          style={{ width: 200, height: 200 }}
          source={{ uri: `${offerCard?.image_url}` }}
        />
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
        modalContent: (offerCard?.type == 'paid' && offerCard?.is_seen == 'false') ? getOfferDetailsContent():getOfferDetailsContentWithoutTimer(),
        modalStyles: {
          containerStyles: {
            alignItems: 'center',
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
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      setOfferCard(item);
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] })
      }
      if(item?.type == 'paid' && item?.is_seen == 'false'){
        setUpdateMailRedeem({
          user_uuid: userDetails?.uuid,
          mail_uuid: item?.uuid
        });
      }
      
    }
    else{
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      setOfferCard(item);
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] })
      }
    
    }
  };

  return (
    <View style={styles.pageContainer}>
      <View
        style={{
          width: '100%',
          paddingVertical: 10,
          backgroundColor: '#00AEEF',
          alignItems: 'center',
          marginBottom: 5
        }}>
        <View
          style={{
            position: 'relative',
            width: '70%',
            height: 35,
          }}>
          <EvilIcon
            name="search"
            size={25}
            color="#A7A7A7"
            style={{
              position: 'absolute',
              left: 7,
              zIndex: 1,
              top: 7,
            }}
          />
          <TextInput
            style={{
              backgroundColor: colors.bgPrimary,
              width: '100%',
              height: '100%',
              color: '#222',
              paddingVertical: 10,
              borderRadius: 50,
              paddingRight: 15,
              paddingLeft: 35,
            }}
            placeholderTextColor="#A7A7A7"
            placeholder="Search for category"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View style={{clear: 'both', width: '100%', marginBottom:'35%'}}>
      {mailPageData && <FlatList
        ItemSeparatorComponent={
          Platform.OS !== 'android' &&
          (({highlighted}) => (
            <View
              style={[styles.separator, highlighted && {marginLeft: 0}]}
            />
          ))
        }
        columnWrapperStyle={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}
        numColumns={2}
        horizontal={false}
        onEndReached={() => {
          setPageNum((prevPage) => prevPage + 1);
        }}
        onEndReachedThreshold={0.1}
        // onEndReached={loadMoreData}
        onScrollEndDrag={() => console.log("end")}
        data={filterValue ? mailPageData.filter((item) => {
          return item?.brand.some((val) => val.company_name.toLowerCase().startsWith(filterValue?.toLowerCase()));
        }) : mailPageData}
        renderItem={({item, index}) => {
          let j = index % 4;
          return(
          <TouchableHighlight
            key={index}>
            <OfferCard
                  containerStyles={{
                    margin: 5,
                    backgroundColor: offerCardColors[j]
                  }}
                  isRedeemed={item?.is_seen === 'true' ? true : false}
                  onTap={() => onOfferCardClick(index, item)}
                  isFavourite={item?.is_favourite === 'true' ? true :  false}
                  onFavouriteToggle={(e) => onFavouriteMailToggle(item?.uuid)}
                  key={index}
                  item={item}
                />
          </TouchableHighlight>
        )}}
      />}
      </View>
    </View>
  );
};

export default Mails;
