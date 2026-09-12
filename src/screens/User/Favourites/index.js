import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, ScrollView, TextInput, FlatList, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { rewardsScreenStyles } from './index.style';
import { WebView } from 'react-native-webview';
import Grid from '../../../components/atoms/Grid';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import getColors from '../../../utils/colors';
import { UserContext } from '../../../context/UserContext';
import { DeviceContext } from '../../../context/DeviceContext';
import { useReward } from '../../../hooks/services/useReward';
import { useFavourites } from '../../../hooks/services/useFavourites';
import { useMail } from '../../../hooks/services/useMail';
import OfferCard from '../../../components/organisms/OfferCard';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { ModalContext } from '../../../context/ModalContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useInterval } from '../../../hooks/useInterval';
import RedeemModalContent from '../Home/RedeemModalContent';
import { styles as homeScreenStyles } from '../Home/index.style';
import Toast from 'react-native-simple-toast';
import YouTubePlayer from '../Youtube';
import MailDetailModal from '../../../components/organisms/MailDetailModal';

const Favourites = ({ navigation }) => {
  const [pageNum, setPageNum] = useState(0);
  const [PageSize, setPageSize] = useState(100);
  const isDarkMode = false;
  const styles = rewardsScreenStyles();
  const stylesTimer = homeScreenStyles();
  const { userDetails } = useContext(UserContext);
  const { screenWidth, screenHeight } = useContext(DeviceContext);
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

  const { themeColors: colors, rewardsScreenColors } = getColors();

  useFocusEffect(
    useCallback(() => {
      setFavPayload(`pagenum=${pageNum}&limit=${PageSize}&user_uuid=${userDetails?.uuid}&key=${Math.random()}`);
    }, [pageNum])
  );

  const onSelectSwitch = index => {
    setPageNum(0);
    setOption(index);
  };

  const onFavouriteToggle = (uuid, type = '') => {
    type === 'brand' ? setUpdateBrandFav({
      user_uuid: userDetails?.uuid,
      brand_uuid: uuid,
    }) : setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: uuid,
    });
  };


  const onBrandSelect = (e, brand_uuid, category_uuid) => {
    // setActiveBrand(e ? brand_uuid : '');
    navigation.navigate('Home', { brand_uuid: brand_uuid, category_uuid: { uuid: category_uuid[0] } });
  };


  useEffect(() => {
    if (seconds == 0) {
      Toast.show(redeemSuccessMessage, Toast.LONG, {
        backgroundColor: '#45B39D',
      });
    }
  }, [seconds]);

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

  const renderOfferDetailModal = (withTimer = false) => (
    <MailDetailModal
      offerCard={offerCard}
      mailHTML={mailHTML}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      onClose={closeAdd}
      seconds={withTimer ? seconds : 0}
      renderVideo={url => <YouTubePlayer videoUrl={url} />}
    />
  );

  const closeAdd = () => {
    setSeconds(18);
    setIsOfferClicked(false);
    setTimer(0);
    stop();
    setModalDetails({});
  };

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
        modalContent: (offerCard?.type == 'paid' && offerCard?.is_seen == 'false') ? renderOfferDetailModal(true) : renderOfferDetailModal(false),
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
  }, [seconds, isOfferClicked, mailHTML, offerCard]);

  const onOfferCardClick = (index, item) => {
    if (!redeemedOfferIndexes.includes(index)) {
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      setOfferCard(item);
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] });
      }
      if (item?.type == 'paid' && item?.is_seen == 'false') {
        setUpdateMailRedeem({
          user_uuid: userDetails?.uuid,
          mail_uuid: item?.uuid,
        });
      }


    }
    else {
      setSelectedOfferIndex(index);
      setIsOfferClicked(true);
      setOfferCard(item);
      if (item?.mime_type === 'text/html') {
        const url = item?.image_url?.split('/');
        setMailURL({ html_url: url.slice(-1)[0] });
      }

    }
  };

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.searchBand}>
        <View style={styles.searchWrapper}>
          <EvilIcon
            name="search"
            size={25}
            color={colors.fontMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={colors.fontMuted}
            placeholder="Search for brands"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View style={styles.favouriteTabStrip}>
        <View style={styles.favouriteTabBar}>
          {[
            {label: 'Brands', value: 1},
            {label: 'Mails', value: 2},
          ].map(tab => {
            const isActive = option === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.82}
                style={[
                  styles.favouriteTabButton,
                  isActive ? styles.favouriteTabButtonActive : null,
                ]}
                onPress={() => onSelectSwitch(tab.value)}>
                <Text
                  style={[
                    styles.favouriteTabText,
                    isActive ? styles.favouriteTabTextActive : null,
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.brandGridWrapper}>
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
            key="brand-grid-2"
            columnWrapperStyle={styles.brandListRow}
            contentContainerStyle={styles.brandListContent}
            numColumns={2}
            horizontal={false}
            onEndReached={() => {
              console.log('Page:', pageNum);
              setPageNum((prevPage) => prevPage + 1);
            }}
            onEndReachedThreshold={0.1}
            scrollEnabled={false}
            data={filterValue !== '' ? brandData.filter((item) => {
              return item?.company_name
                .toLowerCase()
                .startsWith(filterValue?.toLowerCase());
            }) : brandData}
            keyExtractor={(item, index) => item?.uuid || `${index}`}
            renderItem={({ item, index }) => (

              // <TouchableHighlight
              //   key={i}>
              <View
                key={item?.uuid || index}
                style={styles.brandCardShell}>
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
                  key={item?.uuid || index}
                  item={item}
                  // rounded
                  isFavourite={true}
                  color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                  wrapperStyles={styles.brandCard}
                  // containerStyles={{
                  //   marginBottom: i + 1 < barndList?.length ? 20 : 0,
                  // }}
                  onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid, 'brand')}
                  onBrandSelect={(e) => onBrandSelect(e, item?.uuid, item.category_uuid)}
                  src={item?.logo_url}
                  showAddress={false}
                  showActionByDefault={true}
                  size={120}
                />
              </View>
              // </TouchableHighlight>
            )}
          />}
          {/* </Grid>} */}
        </> : <>
          {mailData?.length > 0 ? (
            <View style={styles.mailList}>
              {mailData
                .filter(item => {
                  if (!filterValue) {
                    return true;
                  }
                  return item?.brand?.some(val =>
                    val.company_name
                      ?.toLowerCase()
                      .includes(filterValue?.toLowerCase()),
                  );
                })
                .map((item, i) => (
                  <OfferCard
                    key={item?.uuid || String(i)}
                    variant="feed"
                    item={item}
                    isFavourite
                    isRedeemed={item?.is_seen === 'true'}
                    onTap={() => onOfferCardClick(i, item)}
                    onFavouriteToggle={() => onFavouriteToggle(item?.uuid)}
                  />
                ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No saved mails</Text>
              <Text style={styles.emptySubtitle}>
                Favourite offers to find them here quickly.
              </Text>
            </View>
          )}
        </>}
      </View>
    </ScrollView>
  );
};

export default Favourites;
