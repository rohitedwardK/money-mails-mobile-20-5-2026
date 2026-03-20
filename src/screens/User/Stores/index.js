import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableHighlight } from 'react-native';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import { useFocusEffect } from "@react-navigation/core";
import { favPageStyles } from './index.style';
import getColors from '../../../utils/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { DeviceContext } from '../../../context/DeviceContext';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useBrand } from "../../../hooks/services/useBrand";
import { useBrandPage } from '../../../hooks/services/useBrandPage';
import { UserContext } from "../../../context/UserContext";


const Store = ({ navigation }) => {
  const { themeColors: colors, isDarkMode } = getColors();
  const { userDetails, location, setActiveBrand, activeBrand, activeCategory,  } = useContext(UserContext);
  const { screenWidth } = useContext(DeviceContext);
  const { barndList, brandCount, isBrandLoading, brandError, setBrandPayload, setUpdateBrandFav } = useBrand();
  const { brandPageData, setBrandPagePayload } = useBrandPage();
  const styles = favPageStyles();

  const [filterValue, setFilterValue] = useState('');
  const [selCountry, setSelCountry] = useState('');
  const [selState, setSelState] = useState('');
  const [selCounty, setSelCounty] = useState('');
  const [selCity, setSelCity] = useState('');
  const [PageSize, setPageSize] = useState(20);
  const [pageNum, setPageNum] = useState(0)


  useEffect(() => {
    if (location.country?.uuid) setSelCountry(location.country?.uuid)
    if (location.state?.uuid) setSelState(location.state?.uuid)
    if (location.county?.uuid) setSelCounty(location.county?.uuid)
    if (location.city?.uuid) setSelCity(location.city?.uuid)
  }, [location])


  useFocusEffect(useCallback(() => {
    let key = Math.random();
    setBrandPagePayload(`pagenum=${pageNum}&limit=${PageSize}&country_uuid=${selCountry}&state_uuid=${selState}&city_uuid=${selCity}&county_uuid=${selCounty}&user_uuid=${userDetails?.uuid}&category_uuid=${activeCategory?.uuid}&key=${key}`);
  }, [activeCategory, pageNum]))



  const onFavouriteToggle = (brand_uuid) => {
    setUpdateBrandFav({
      user_uuid: userDetails?.uuid,
      brand_uuid: brand_uuid
    });
  }

  const onBrandSelect = (e, brand_uuid) => {
    setActiveBrand(e ? brand_uuid : '');
    const categoryObj = { ...activeCategory, value: activeCategory.uuid };

    navigation.navigate('User', {
      screen: 'Home',
      params: { 
        brand_uuid: brand_uuid,
        category_uuid: categoryObj
      }
    });
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
            placeholder="Search for brands"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>
      <View style={{ clear: 'both', width: '100%' }}>
        {brandPageData && <FlatList
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
            setPageNum(pageNum + 1)
          }}
          onEndReachedThreshold={0.1}
          onScrollEndDrag={() => console.log("end")}
          data={filterValue !== "" ? brandPageData.filter((item) => {
            return item?.company_name
              .toLowerCase()
              .startsWith(filterValue?.toLowerCase());
          }) : brandPageData}
          renderItem={({ item, i }) => (
            <TouchableHighlight
              key={i}>
              <View
                key={i}
                style={{
                  width: 120,
                  height: 120,
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <BrandIconCard
                  key={i}
                  isActive={activeBrand?.indexOf(item?.uuid) !== -1 || item?.is_highlight === 'true' ? true : false}
                  isFavourite={item?.is_faviourate === 'true' ? true : false}
                  item={item}
                  color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                  onActionPress={() => console.log('okk')}
                  onFavouriteToggle={(e) => onFavouriteToggle(item?.uuid)}
                  onBrandSelect={(e) => onBrandSelect(e, item?.uuid)}
                  showActionByDefault
                  actionBtnOverridingStyles={{
                    backgroundColor: '#f8f8f8',
                  }}
                  showAddress={true}
                  src={item?.logo_url}
                  size="100%">
                  {/* <Image 
                    style={{width: '70%', height: '70%'}}
                    key={i}
                    source={{uri:`${item?.logo_url}`}} 
                    resizeMode={'cover'}
                  /> */}
                </BrandIconCard>
              </View>
            </TouchableHighlight>
          )}
        />}
      </View>
      {/* {barndList?.length > 0 && <Grid
        columnsPerRow={3}
        wrap
        gap={5}
        gapY={5}
        squareChildren
        containerStyles={{
          paddingHorizontal: 10,
          paddingLeft: 13,
          marginVertical: 30,
          height: '100%',
          width: screenWidth,
          justifyContent: 'center',
        }}>
          
         {barndList && barndList
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
              <View
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                }}>
                <BrandIconCard
                  key={i}
                  isFavourite={item?.is_faviourate === 'true' ? true :  false}
                  color={isDarkMode ? colors.bgPrimary : '#EEF8FF'}
                  onActionPress={() => {}}
                  showActionByDefault
                  item={item}
                  actionBtnOverridingStyles={{
                    backgroundColor: '#f8f8f8',
                  }}
                  size="100%">
                  <Image 
                    style={{width: 50, height: 50}}
                    key={i}
                    source={{uri:`${item?.logo_url}`}}
                    resizeMode={'cover'}
                  />
                </BrandIconCard>
              </View>
            );
          })} 
      </Grid>} */}
    </View>

  );
};

export default Store;
