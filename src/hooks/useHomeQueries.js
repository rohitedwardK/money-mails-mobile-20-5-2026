import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  fetchBrands,
  fetchCategories,
  fetchMails,
  fetchQuickOffers,
  fetchStoreProfile,
  fetchSubCategories,
} from '../api/moneyMails';

export const DO_YOU_KNOW_TAB_UUID = '__do_you_know__';
export const QUICK_OFFERS_TAB_UUID = '__quick_offers__';

export const useHomeQueries = ({
  selCity,
  selState,
  selCountry,
  selCounty,
  selCategory,
  selBrand,
  subCatActive,
  seen,
  userDetails,
}) => {
  const userUuid = userDetails?.uuid || userDetails?.user_uuid;
  const locationReady = !!selCountry && !!userUuid;
  const userCoords = userDetails?.location?.coordinates;
  const [userLng, userLat] = userCoords?.length === 2 ? userCoords : [];

  const categoryQuery = useQuery({
    queryKey: ['home-categories', {city_uuid: selCity, user_uuid: userUuid}],
    queryFn: () =>
      fetchCategories({
        search: '',
        user_uuid: userUuid,
        city_uuid: selCity,
      }),
    enabled: locationReady && !!selCity,
    refetchInterval: 10000,
  });

  const categoryList = categoryQuery.data || [];

  const brandQuery = useQuery({
    queryKey: [
      'home-brands',
      {
        category_uuid: selCategory,
        country_uuid: selCountry,
        state_uuid: selState,
        city_uuid: selCity,
        county_uuid: selCounty,
        user_uuid: userUuid,
        user_lng: userLng,
        user_lat: userLat,
      },
    ],
    queryFn: () =>
      fetchBrands({
        pagenum: 0,
        limit: 16,
        user_uuid: userUuid,
        category_uuid: selCategory,
        country_uuid: selCountry,
        state_uuid: selState,
        city_uuid: selCity,
        county_uuid: selCounty,
        brand_uuid: '',
        ...(userLng != null ? {user_lng: userLng, user_lat: userLat} : {}),
      }),
    enabled: locationReady && !!selCategory,
    refetchInterval: 10000,
  });

  const brandList = useMemo(
    () => brandQuery.data?.data || [],
    [brandQuery.data?.data],
  );

  const effectiveBrands = useMemo(() => {
    if (Array.isArray(selBrand) && selBrand.length > 0) {
      return selBrand.filter(Boolean);
    }

    if (selBrand) {
      return [selBrand];
    }

    return brandList.map(item => item.uuid).filter(Boolean);
  }, [brandList, selBrand]);

  const subCategoryQuery = useQuery({
    queryKey: [
      'home-subcategories',
      {
        category_uuid: selCategory,
        country_uuid: selCountry,
        state_uuid: selState,
        city_uuid: selCity,
        county_uuid: selCounty,
        brands: Array.isArray(selBrand) ? selBrand.join(',') : selBrand || '',
        user_uuid: userUuid,
      },
    ],
    queryFn: () =>
      fetchSubCategories({
        search: '',
        user_uuid: userUuid,
        category_uuid: selCategory,
        country_uuid: selCountry,
        state_uuid: selState,
        city_uuid: selCity,
        county_uuid: selCounty,
        ...(Array.isArray(selBrand) && selBrand.length > 0
          ? {brand_uuid: selBrand}
          : {}),
      }),
    enabled: locationReady && !!selCategory && !brandQuery.isLoading,
    refetchInterval: 10000,
    select: data =>
      [...(data || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  });

  const mailQuery = useQuery({
    queryKey: [
      'home-mails',
      {
        country_uuid: selCountry,
        state_uuid: selState,
        city_uuid: selCity,
        county_uuid: selCounty,
        category_uuid: selCategory,
        brands: effectiveBrands.join(','),
        sub_category_uuid: subCatActive,
        seen,
        user_uuid: userUuid,
      },
    ],
    queryFn: () =>
      fetchMails({
        country_uuid: selCountry,
        state_uuid: selState || '',
        city_uuid: selCity || '',
        county_uuid: selCounty || '',
        user_uuid: userUuid,
        category_uuid: selCategory,
        brand_uuid: effectiveBrands,
        sub_category_uuid: subCatActive,
        type: 'filter',
        search: '',
        pagenum: '',
        limit: '',
        seen: seen || '',
        ...(userLng != null ? {user_lng: userLng, user_lat: userLat} : {}),
      }),
    enabled:
      !!subCatActive &&
      subCatActive !== DO_YOU_KNOW_TAB_UUID &&
      !!selCategory &&
      !subCategoryQuery.isLoading,
    refetchInterval: 10000,
  });

  const selectedStoreUuid = Array.isArray(selBrand) ? selBrand[0] : selBrand;

  const doYouKnowQuery = useQuery({
    queryKey: ['store-profile', {storeUuid: selectedStoreUuid}],
    queryFn: () => fetchStoreProfile(selectedStoreUuid),
    enabled: !!selectedStoreUuid,
    refetchInterval: 30000,
  });

  const quickOffersQuery = useQuery({
    queryKey: ['quick-offers', {storeUuid: selectedStoreUuid}],
    queryFn: () => fetchQuickOffers(selectedStoreUuid),
    enabled: !!selectedStoreUuid,
    refetchInterval: 30000,
  });

  return {
    categoryList,
    isCategoryLoading: categoryQuery.isLoading,
    brandList,
    barndList: brandList,
    brandCount: brandQuery.data?.count || 0,
    isBrandLoading: brandQuery.isLoading,
    subCategoryList: subCategoryQuery.data || [],
    isSubCategoryLoading: subCategoryQuery.isLoading,
    mailList: mailQuery.data?.data || [],
    mailCount: mailQuery.data?.count || 0,
    isMailLoading: mailQuery.isLoading,
    doYouKnowData: doYouKnowQuery.data,
    isDoYouKnowLoading: doYouKnowQuery.isLoading,
    quickOffersData: quickOffersQuery.data,
    isQuickOffersLoading: quickOffersQuery.isLoading,
    quickOffersError: quickOffersQuery.error,
  };
};
