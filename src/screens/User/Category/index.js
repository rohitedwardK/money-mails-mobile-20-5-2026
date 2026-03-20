import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import OfferCard from '../../../components/organisms/OfferCard';
import { categoryPageStyles } from './index.style';
import SubCatCard from '../../../components/molecules/SubCatCard';
import GroceriesSvgIcon from '../../../assets/images/categoryIcons/groceries.svg.js';
import DeliverySvgIcon from '../../../assets/images/categoryIcons/delivery.svg.js';
import HospitalSvgIcon from '../../../assets/images/categoryIcons/hospital.svg.js';
import FoodSvgIcon from '../../../assets/images/categoryIcons/food.svg.js';
import Grid from '../../../components/atoms/Grid';
import getColors from '../../../utils/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { DeviceContext } from '../../../context/DeviceContext';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useCategory } from "../../../hooks/services/useCategory";
import { useMail } from "../../../hooks/services/useMail";
import { UserContext } from "../../../context/UserContext";
import { useSubCategory } from "../../../hooks/services/useSubCategory";

let pageNum = 1;
const PageSize = 15;

const Category = ({ navigation }) => {
  const { themeColors: colors, isDarkMode } = getColors();
  const { screenWidth } = useContext(DeviceContext);
  const { userDetails, activeCategory, setActiveCategory } = useContext(UserContext);
  const { categoryList = [], isCatLoading, catError, setCatPayload } = useCategory();
  const styles = categoryPageStyles();
  const { mailList = [], mailCount, isRedeem, redeemMessage, redeemError, mailHTML, setMailPayload, setUpdateMailFav, setUpdateMailRedeem, setMailURL } = useMail();
  const { subCategoryList = [], setSubCatPayload } = useSubCategory();
  const [currentPage, setCurrentPage] = useState(1);

  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    setCatPayload(`search=&user_uuid=${userDetails?.uuid}`);
  }, [])

  useEffect(() => {
    if (userDetails?.address && subCategoryList) setMailPayload(`pagenum=${pageNum}&limit=${PageSize}&country_uuid=${userDetails?.address?.country}&state_uuid=${userDetails?.address?.state}&city_uuid=${userDetails?.address?.city}&sub_category_uuid=${subCategoryList[0].uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${userDetails?.address?.county}`);
  }, [userDetails, subCategoryList])

  const loadMoreData = () => {
    if (userDetails?.address && subCategoryList) setMailPayload(`pagenum=${pageNum}&limit=${PageSize}&country_uuid=${userDetails?.address?.country}&state_uuid=${userDetails?.address?.state}&city_uuid=${userDetails?.address?.city}&sub_category_uuid=${subCategoryList[0].uuid}&user_uuid=${userDetails?.uuid}&county_uuid=${userDetails?.address?.county}`);
  }

  const onFavouriteMailToggle = (mail_uuid) => {
    setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: mail_uuid
    });
  }

  const onCategorySelect = (e, brand_uuid) => {
    setActiveCategory(e ? brand_uuid : '');
    navigation.navigate('Home',{category_uuid:{uuid: brand_uuid}})
  }
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
          <TouchableOpacity>
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
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ clear: 'both', width: '100%' }}>
        {categoryList?.length > 0 && <FlatList
          ItemSeparatorComponent={
            Platform.OS !== 'android' &&
            (({ highlighted }) => (
              <View
                style={[styles.separator, highlighted && { marginLeft: 0 }]}
              />
            ))
          }
          columnWrapperStyle={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', height: '100%' }}
          numColumns={3}
          horizontal={false}
          // onEndReached={loadMoreData}
          onScrollEndDrag={() => console.log('end')}
          data={filterValue ? categoryList.filter((item, i) => {
            return item?.name
              .toLowerCase()
              .startsWith(filterValue?.toLowerCase());
          }) : categoryList}
          renderItem={({ item, i }) => (
            <TouchableOpacity
              key={i}>
              <View style={{
                padding: 5,
                margin: 5, 
                width: 100,
                height: 100, 
                alignItems: 'center',
                borderWidth: 2,
                borderColor: item?.uuid === activeCategory ? '#4cc7f5' : '#efefef',
                borderRadius: 500
                }}>
                <SubCatCard
                  color={
                    colors.bgPrimary
                  }
                  disableSelect
                  rounded
                  wrapperStyles={styles.rewardCategoryIcon}
                  onPress={(e)=> onCategorySelect(e, item?.uuid)}
                  size={50}>
                  <Image
                    key={i}
                    source={{ uri: `${item?.image}` }}
                    style={{ width: 40, height: 40 }}
                    resizeMode={'cover'}
                  />
                </SubCatCard>
                  <Text style={[styles.rewardItemTitle, { color : '#222'}]}>{item?.name}</Text>
                  <Text style={[styles.rewardItemTitle, { color : '#222'}]}>{item?.mails_count}</Text>
                <View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />}
      </View>
    </View>
  );
};

export default Category;
