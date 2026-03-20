import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, ScrollView, TextInput, FlatList, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { rewardsScreenStyles } from './index.style';
import { WebView } from 'react-native-webview';
import Grid from '../../../components/atoms/Grid';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import getColors from '../../../utils/colors';
import { UserContext } from "../../../context/UserContext";
import { DeviceContext } from '../../../context/DeviceContext';
import { useReward } from "../../../hooks/services/useReward";
import { useFavourites } from "../../../hooks/services/useFavourites";
import { useMail } from "../../../hooks/services/useMail";
import CustomSwitch from '../../../components/switch';
import OfferCard from '../../../components/organisms/OfferCard';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { ModalContext } from '../../../context/ModalContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useInterval } from '../../../hooks/useInterval';
import RedeemModalContent from '../Home/RedeemModalContent';
import { styles as homeScreenStyles } from '../Home/index.style';
import Toast from 'react-native-simple-toast';
import YouTubePlayer from '../Youtube';
import Pdf from 'react-native-pdf';

const Favourites = ({ navigation }) => {
  const [pageNum, setPageNum] = useState(0);
  const [PageSize, setPageSize] = useState(100);
  const isDarkMode = false;
  const styles = rewardsScreenStyles();
  const stylesTimer = homeScreenStyles();
  const { userDetails } = useContext(UserContext);
  const { screenWidth } = useContext(DeviceContext);
  const [option, setOption] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { brandData = [], mailData = [], isLoading, setFavPayload, setUpdateBrandFav, setUpdateMailFav } = useFavourites();
  const { mailList, mailCount, isRedeem, redeemMessage, redeemSuccessMessage, redeemError, mailHTML, setMailPayload, setUpdateMailRedeem, setMailURL } = useMail();

  const { rewards, setPayload } = useReward();
  const [selCategory, setSelectCategory] = useState('');
  const [category, setCategory] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [redeemedOfferIndexes, setRedeemedOfferIndexes] = useState([]);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState();
  const [isOfferClicked, setIsOfferClicked] = useState(false);
  const [offerCard, setOfferCard] = useState({});
  const [seconds, setSeconds] = useState(0);
  const { setModalDetails } = useContext(ModalContext);

  const { themeColors: colors, rewardsScreenColors, offerCardColors } = getColors();

  useFocusEffect(
    useCallback(() => {
      setFavPayload(`pagenum=${pageNum}&limit=${PageSize}&user_uuid=${userDetails?.uuid}&key=${Math.random()}`);
    }, [pageNum])
  );

  const onSelectSwitch = index => {
    setPageNum(0);
    setOption(index)
  };

  const onFavouriteToggle = (uuid, type = '') => {
    type === 'brand' ? setUpdateBrandFav({
      user_uuid: userDetails?.uuid,
      brand_uuid: uuid
    }) : setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: uuid
    })
  }


  const onBrandSelect = (e, brand_uuid, category_uuid) => {
    // setActiveBrand(e ? brand_uuid : '');
    navigation.navigate('Home', { brand_uuid: brand_uuid, category_uuid: { uuid: category_uuid[0] } })
  }


  useEffect(() => {
    if (seconds == 0) {
      Toast.show(redeemSuccessMessage, Toast.LONG, {
        backgroundColor: '#45B39D',
      })
    }
  }, [seconds])

  const { start, stop, setTimer } = useInterval(count => {

    setSeconds(count);
    if (count === 18) {
      setSeconds(0);
      setRedeemedOfferIndexes([...redeemedOfferIndexes, selectedOfferIndex]);
      setSelectedOfferIndex();
      // setIsOfferClicked(false);

      if (offerCard?.type == 'paid' && offerCard?.is_seen != 'true') {

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
      <View style={{ backgroundColor: "#FFFFFF", flex: 1, minWidth: screenWidth - 10 }}>

        <View>
          <View style={styles.timerContainer}>
            {/* <Text style={styles.secondsCounter}>{18 - seconds}</Text> */}
            {seconds > 0 && <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 18 }}>Please Wait...</Text></View>}
            {seconds == 0 && <View style={{ width: 40, justifyContent: 'flex-start' }}><TouchableOpacity onPress={closeAdd} style={{
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
            </TouchableOpacity></View>
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
          {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') && <View style={{ alignItems: 'center' }}>
            <Image
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
              source={{ uri: `${offerCard?.image_url}` }}
            />
          </View>}

          {(offerCard?.mime_type === 'application/pdf') && <Pdf
            source={{
              uri: offerCard?.image_url,
              cache: true
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages) => {
            }}
            onError={(error) => {
              console.log(error);
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
          }

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
    setIsOfferClicked(false);
    setTimer(0);
    stop();
    setModalDetails({})
  }

  const getOfferDetailsContentWithoutTimer = () => (
    <>
      <View style={{ backgroundColor: "#FFFFFF", flex: 1, minWidth: screenWidth - 10 }}>

        <View>
          <View style={styles.timerContainer}>
            <View style={{ width: 40, justifyContent: 'flex-start' }}>
              <TouchableOpacity onPress={closeAdd} style={{
                backgroundColor: '#45B39D',
                borderRadius: 10,
                padding: 10,
                width: 40
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
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#000000', fontSize: 18, padding: 5 }}>{offerCard?.message}</Text>
          </View>

          {(offerCard?.mime_type === 'text/html' && offerCard?.image_url) && <View style={{ flex: 1 }}><WebView
            source={{
              // uri: `${offerCard?.image_url}`,
              html: mailHTML
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: screenWidth - 10,
              minHeight: '40%'
            }}
          /></View>}
          {(offerCard?.mime_type === 'image/png' || offerCard?.mime_type === 'image/jpeg') && <View style={{ alignItems: 'center' }}><Image
            resizeMode="contain"
            style={{ width: 200, height: 200 }}
            source={{ uri: `${offerCard?.image_url}` }}
          />
          </View>}


          {(offerCard?.mime_type === 'application/pdf') && <Pdf
            source={{
              uri: offerCard?.image_url,
              cache: true
            }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onError={(error) => {
              console.log(error);
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
      if (item?.type == 'paid' && item?.is_seen == 'false') {
        setUpdateMailRedeem({
          user_uuid: userDetails?.uuid,
          mail_uuid: item?.uuid
        });
      }


    }
    else {
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
    <ScrollView style={styles.pageContainer}>
      <View
        style={{
          width: '98%',
          alignItems: 'flex-start',
          paddingVertical: 10,
          backgroundColor: '#00AEEF',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
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
              paddingVertical: 10,
              borderRadius: 50,
              paddingRight: 15,
              paddingLeft: 35,
              color: '#222'
            }}
            placeholderTextColor="#A7A7A7"
            placeholder="Search for brands"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View styles={styles.header}>
        <CustomSwitch
          selectionMode={option}
          roundCorner={true}
          option1={'Brands'}
          option2={'Mails'}
          onSelectSwitch={onSelectSwitch}
          selectionColor={'#1890ff'}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        {option === 1 ? <>
          {/* {brandData?.length > 0 && <Grid
            columnsPerRow={3}
            wrap
            gap={30}
            squareChildren
            containerStyles={{
              marginVertical: 30,
              justifyContent: 'center',
            }}> */}
          {/* {brandData && brandData
              .filter((item, i) => {
                if (!filterValue) {
                  return true;
                }
                return item?.company_name
                  .toLowerCase()
                  .startsWith(filterValue?.toLowerCase());
              })
              .map((item, i) => {
                const isDarkMode = false;
                return (
                  <BrandIconCard
                    key={item?.uuid}
                    isFavourite={true}
                    item={item}
                    color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                    onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid, 'brand')}
                    onActionPress={() => { }}
                    onBrandSelect={(e)=> onBrandSelect(e, item?.uuid,item.category_uuid)}
                    showActionByDefault
                    actionBtnOverridingStyles={{
                      backgroundColor: '#f8f8f8',
                    }}
                    src={item?.logo_url}
                    size={120}>
                  </BrandIconCard>
                );
              })} */}

          {brandData && <FlatList
            ItemSeparatorComponent={
              Platform.OS !== 'android' &&
              (({ highlighted }) => (
                <View
                  style={[styles.separator, highlighted && { marginLeft: 0 }]}
                />
              ))
            }
            columnWrapperStyle={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
            numColumns={3}
            horizontal={false}
            onEndReached={() => {
              console.log("Page:", pageNum)
              setPageNum((prevPage) => prevPage + 1);
            }}
            onEndReachedThreshold={0.1}
            scrollEnabled={false}
            onScrollEndDrag={() => console.log("end")}
            data={filterValue !== "" ? brandData.filter((item) => {
              return item?.company_name
                .toLowerCase()
                .startsWith(filterValue?.toLowerCase());
            }) : brandData}
            renderItem={({ item, i }) => (

              // <TouchableHighlight
              //   key={i}>
              <View
                key={i}
                style={{
                  width: 120,
                  height: 120,
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                {/* <BrandIconCard
                    key={item?.uuid}
                    isFavourite={true}
                    item={item}
                    color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                    onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid, 'brand')}
                    onActionPress={() => { }}
                    onBrandSelect={(e)=> onBrandSelect(e, item?.uuid,item.category_uuid)}
                    showActionByDefault
                    actionBtnOverridingStyles={{
                      backgroundColor: '#f8f8f8',
                    }}
                    src={item?.logo_url}
                    showAddress={true}
                    size={120}>
                  </BrandIconCard> */}
                <BrandIconCard
                  // isActive={selBrand.indexOf(item.uuid) !== -1 || item.is_highlight === 'true' ? true : false}
                  key={i}
                  item={item}
                  // rounded
                  isFavourite={true}
                  color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                  // containerStyles={{
                  //   marginBottom: i + 1 < barndList?.length ? 20 : 0,
                  // }}
                  onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid, 'brand')}
                  onBrandSelect={(e) => onBrandSelect(e, item?.uuid,item.category_uuid)}
                  src={item?.logo_url}
                  onActionPress={() => console.log('0000')}
                  showAddress={false}
                  showActionByDefault={true}
                  size={120}>
                </BrandIconCard>
              </View>
              // </TouchableHighlight>
            )}
          />}
          {/* </Grid>} */}
        </> : <>
          {mailData?.length > 0 && <View style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingVertical: 30,
            paddingHorizontal: 10,
            justifyContent: 'space-around',
          }}>
            {mailData && mailData
              .filter((item, i) => {
                if (!filterValue) {
                  return true;
                }
                return item?.brand.some((val) => val.company_name.toLowerCase().startsWith(filterValue?.toLowerCase()));
              })
              .map((item, i) => {
                let j = i % 4;
                return (<OfferCard
                  containerStyles={{
                    marginBottom: 20,
                    backgroundColor: offerCardColors[j]
                  }}
                  item={item}
                  isFavourite={true}
                  isRedeemed={item?.is_seen === 'true' ? true : false}
                  onTap={() => onOfferCardClick(i, item)}
                  onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid)}
                  key={item?.uuid}
                />
                );
              })}
          </View>}
        </>}
      </View>
    </ScrollView>
  );
};

export default Favourites;
