import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import { useFocusEffect } from '@react-navigation/core';
import { favPageStyles } from './index.style';
import getColors from '../../../utils/colors';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useBrand } from '../../../hooks/services/useBrand';
import { useBrandPage } from '../../../hooks/services/useBrandPage';
import { UserContext } from '../../../context/UserContext';
import { DeviceContext } from '../../../context/DeviceContext';

const storeDoodleItems = [
  {name: 'leaf', size: 22, top: 10, left: 0, rotate: '18deg'},
  {name: 'star', size: 21, top: 22, left: 44, rotate: '-10deg'},
  {name: 'wallet', size: 27, top: 4, left: 142, rotate: '0deg'},
  {name: 'shopping-basket', size: 24, top: 34, left: 172, rotate: '8deg'},
  {name: 'mail', size: 29, top: 9, left: 230, rotate: '-12deg'},
  {name: 'price-tag', size: 23, top: 8, right: 88, rotate: '17deg'},
  {name: 'star', size: 27, top: 23, right: 38, rotate: '4deg'},
  {name: 'leaf', size: 22, top: 43, right: 2, rotate: '-14deg'},
];

const Store = ({ navigation }) => {
  const { themeColors: colors, isDarkMode } = getColors();
  const { userDetails, location, setActiveBrand, activeBrand, activeCategory } = useContext(UserContext);
  const { screenWidth } = useContext(DeviceContext);
  const { setUpdateBrandFav } = useBrand();
  const { brandPageData, setBrandPagePayload } = useBrandPage();
  const styles = favPageStyles(screenWidth);

  const [filterValue, setFilterValue] = useState('');
  const [selCountry, setSelCountry] = useState('');
  const [selState, setSelState] = useState('');
  const [selCounty, setSelCounty] = useState('');
  const [selCity, setSelCity] = useState('');
  const [PageSize] = useState(20);
  const [pageNum, setPageNum] = useState(0);
  const filtersReady = Boolean(userDetails?.uuid && selCountry && selCity && activeCategory?.uuid);


  useEffect(() => {
    const address = userDetails?.address || {};

    setSelCountry(location.country?.uuid || address.country || userDetails?.country_uuid || userDetails?.country || '');
    setSelState(location.state?.uuid || address.state || userDetails?.state_uuid || userDetails?.state || '');
    setSelCounty(location.county?.uuid || address.county || userDetails?.county_uuid || userDetails?.county || '');
    setSelCity(location.city?.uuid || address.city || userDetails?.city_uuid || userDetails?.city || '');
  }, [location, userDetails]);


  useFocusEffect(useCallback(() => {
    if (!filtersReady) {
      return;
    }

    let key = Math.random();
    setBrandPagePayload(`pagenum=${pageNum}&limit=${PageSize}&country_uuid=${selCountry}&state_uuid=${selState || ''}&city_uuid=${selCity}&county_uuid=${selCounty || ''}&user_uuid=${userDetails?.uuid}&category_uuid=${activeCategory?.uuid}&key=${key}`);
  }, [
    PageSize,
    activeCategory,
    filtersReady,
    pageNum,
    selCity,
    selCountry,
    selCounty,
    selState,
    setBrandPagePayload,
    userDetails?.uuid,
  ]));



  const onFavouriteToggle = (brand_uuid) => {
    setUpdateBrandFav({
      user_uuid: userDetails?.uuid,
      brand_uuid: brand_uuid,
    });
  };

  const onBrandSelect = (e, brand_uuid) => {
    setActiveBrand(e ? brand_uuid : '');
    const categoryObj = { ...activeCategory, value: activeCategory.uuid };

    navigation.navigate('User', {
      screen: 'Home',
      params: {
        brand_uuid: brand_uuid,
        category_uuid: categoryObj,
      },
    });
  };

  const filteredStores = useMemo(() => {
    if (!Array.isArray(brandPageData)) {
      return [];
    }

    if (!filterValue) {
      return brandPageData;
    }

    return brandPageData.filter(item =>
      item?.company_name
        ?.toLowerCase()
        .startsWith(filterValue?.toLowerCase()),
    );
  }, [brandPageData, filterValue]);

  return (

    <View style={styles.pageContainer}>
      <View style={styles.searchBand}>
        <View pointerEvents="none" style={styles.searchDoodleLayer}>
          {storeDoodleItems.map((item, index) => (
            <EntypoIcon
              key={`${item.name}-${index}`}
              name={item.name}
              size={item.size}
              color={colors.white}
              style={[
                styles.searchDoodleIcon,
                {
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  transform: [{rotate: item.rotate}],
                },
              ]}
            />
          ))}
        </View>
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
      <View style={styles.listWrapper}>
        {brandPageData && <FlatList
          key="store-grid-2"
          columnWrapperStyle={styles.storeListRow}
          contentContainerStyle={styles.storeListContent}
          numColumns={2}
          horizontal={false}
          onEndReached={() => {
            setPageNum(pageNum + 1);
          }}
          onEndReachedThreshold={0.1}
          data={filteredStores}
          keyExtractor={(item, index) => item?.uuid || `${index}`}
          renderItem={({ item, i }) => (
            <View style={styles.storeCardShell}>
              <BrandIconCard
                variant="store"
                wrapperStyles={styles.storeCard}
                isActive={activeBrand?.indexOf(item?.uuid) !== -1 || item?.is_highlight === 'true' ? true : false}
                isFavourite={item?.is_faviourate === 'true' ? true : false}
                item={item}
                color={isDarkMode ? colors.bgPrimary : colors.surfacePrimary}
                onFavouriteToggle={() => onFavouriteToggle(item?.uuid)}
                onBrandSelect={(e) => onBrandSelect(e, item?.uuid)}
                showActionByDefault
                showAddress={true}
                src={item?.logo_url}
              />
            </View>
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
