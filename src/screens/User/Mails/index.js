import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import OfferCard from '../../../components/organisms/OfferCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useCategoryPageStyles} from './index.style';
import getColors from '../../../utils/colors';
import {DeviceContext} from '../../../context/DeviceContext';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useMail } from '../../../hooks/services/useMail';
import { useMailPage } from '../../../hooks/services/useMailPage';
import { UserContext } from '../../../context/UserContext';
import { useSubCategory } from '../../../hooks/services/useSubCategory';
import { useInterval } from '../../../hooks/useInterval';
import { useRoute } from '@react-navigation/native';
import { ModalContext } from '../../../context/ModalContext';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import MailDetailModal from '../../../components/organisms/MailDetailModal';

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
  const route = useRoute();
  const {themeColors: colors} = getColors();
  const {screenWidth, screenHeight} = useContext(DeviceContext);
  const { userDetails } = useContext(UserContext);
  const styles = useCategoryPageStyles();
  const { mailList = [], mailCount, isRedeem, redeemMessage, redeemError,redeemSuccessMessage, mailHTML, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL} = useMail();
  const { mailPageData, setMailPagePayload, setPage } = useMailPage();
  const { subCategoryList = [], setSubCatPayload } = useSubCategory();
  const [currentPage, setCurrentPage] = useState(1);
  const [catuid, setCatuid] = useState('');
  const [subCatuid, setSubCatuid] = useState('');
  const [branduid, setBranduid] = useState('');

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
  },[setSubCatPayload, userDetails?.uuid]);

  useEffect(()=>{

      if(route.params != undefined){
        setPage(pageNum);
        setCatuid(route.params.category_uuid);
        setBranduid(route.params.brand_uuid);
        setSubCatuid(route.params.sub_cat_uuid);
        const nextPayload = buildMailPagePayload({
          pageNum,
          PageSize,
          userDetails,
          catuid: route.params.category_uuid,
          branduid: route.params.brand_uuid,
          subCatuid: route.params.sub_cat_uuid,
        });
        if(nextPayload){setMailPagePayload(nextPayload);}

      }
  },[route.params,isFocused]);

  useEffect(()=>{
    setPage(pageNum);
    const nextPayload = buildMailPagePayload({
      pageNum,
      PageSize,
      userDetails,
      catuid,
      branduid,
      subCatuid,
    });
    if(nextPayload){setMailPagePayload(nextPayload);}
  },[userDetails, subCategoryList,branduid,isFocused,pageNum]);

  const loadMoreData = () => {
    const nextPayload = buildMailPagePayload({
      pageNum,
      PageSize,
      userDetails,
      catuid,
      branduid,
      subCatuid,
    });
    if(nextPayload){setMailPagePayload(nextPayload);}
  };

  const onFavouriteMailToggle = (mail_uuid) => {
    setUpdateMailFav({
      user_uuid : userDetails?.uuid,
      mail_uuid : mail_uuid,
      });
  };

  const renderOfferDetailModal = (withTimer = false) => (
    <MailDetailModal
      offerCard={offerCard}
      mailHTML={mailHTML}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      onClose={closeAdd}
      seconds={withTimer ? seconds : 0}
    />
  );

  useEffect(()=>{
    if(seconds == 0){
      if(redeemSuccessMessage != ''){
        Toast.show(redeemSuccessMessage, Toast.LONG, {
          backgroundColor: '#45B39D',
        });
      }

    }
  },[seconds]);

  const { start, stop,setTimer } = useInterval(count => {

    setSeconds(count);
    if (count === 18) {
      setSeconds(0);
      setRedeemedOfferIndexes([...redeemedOfferIndexes, selectedOfferIndex]);
      setSelectedOfferIndex();
      // setIsOfferClicked(false);

      if(offerCard?.type == 'paid' && offerCard?.is_seen != 'true'){

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

  const closeAdd = () =>{
    setSeconds(18);
    setIsOfferClicked(false);
    setTimer(0);
    stop();
    setPage(1);
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
    if(nextPayload){setMailPagePayload(nextPayload);}
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
      if(item?.type == 'paid' && item?.is_seen == 'false'){
        setUpdateMailRedeem({
          user_uuid: userDetails?.uuid,
          mail_uuid: item?.uuid,
        });
      }

    }
    else{
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
    <View style={styles.pageContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Mails</Text>
        <Text style={styles.screenSubtitle}>Browse offers and deals from your inbox</Text>
      </View>

      <View style={styles.searchBand}>
        <View style={styles.searchWrapper}>
          <EvilIcon
            name="search"
            size={22}
            color={colors.fontMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={colors.fontMuted}
            placeholder="Search by brand name"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          setPageNum(prevPage => prevPage + 1);
        }}
        onEndReachedThreshold={0.2}
        data={
          filterValue
            ? mailPageData?.filter(item =>
                item?.brand?.some(val =>
                  val.company_name
                    ?.toLowerCase()
                    .includes(filterValue?.toLowerCase()),
                ),
              )
            : mailPageData
        }
        keyExtractor={(item, index) => item?.uuid || String(index)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="envelope-open-text" size={42} color={colors.fontMuted} />
            <Text style={styles.emptyTitle}>No mails yet</Text>
            <Text style={styles.emptySubtitle}>
              Offers matching your location will appear here.
            </Text>
          </View>
        }
        renderItem={({item, index}) => (
          <OfferCard
            variant="feed"
            isRedeemed={item?.is_seen === 'true'}
            onTap={() => onOfferCardClick(index, item)}
            isFavourite={item?.is_favourite === 'true'}
            onFavouriteToggle={() => onFavouriteMailToggle(item?.uuid)}
            item={item}
          />
        )}
      />
    </View>
  );
};

export default Mails;
