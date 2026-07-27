import React, { useContext, useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { useCategoryPageStyles } from './index.style';
import getColors from '../../../utils/colors';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCategory } from '../../../hooks/services/useCategory';
import { UserContext } from '../../../context/UserContext';

const Category = ({ navigation }) => {
  const { themeColors: colors } = getColors();
  const { userDetails, activeCategory, setActiveCategory } = useContext(UserContext);
  const { categoryList = [], setCatPayload } = useCategory();
  const styles = useCategoryPageStyles();
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    setCatPayload(`search=&user_uuid=${userDetails?.uuid}`);
  }, [setCatPayload, userDetails?.uuid]);

  const filteredCategories = useMemo(() => {
    if (!filterValue) {
      return categoryList;
    }

    return categoryList.filter(item =>
      item?.name?.toLowerCase().startsWith(filterValue?.toLowerCase()),
    );
  }, [categoryList, filterValue]);

  const onCategorySelect = (e, brand_uuid) => {
    setActiveCategory(e ? brand_uuid : '');
    navigation.navigate('Home', { category_uuid: { uuid: brand_uuid } });
  };

  const renderCategoryCard = ({ item, index }) => {
    const isSelected = item?.uuid === activeCategory;
    const count = item?.mails_count || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={[
          styles.categoryCard,
          isSelected ? styles.categoryCardSelected : null,
        ]}
        onPress={() => onCategorySelect(true, item?.uuid)}>
        <View style={styles.cardImageWrap}>
          {item?.image ? (
            <Image
              source={{ uri: `${item?.image}` }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cardImageFallback}>
              <FontAwesome5 name="store" size={28} color={colors.highlightPrimary} />
            </View>
          )}
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText} numberOfLines={1}>
              {count > 0 ? `${count} active offers` : 'Select items'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.ratingPill}>
            <FontAwesome5 name="star" size={9} color={colors.white} solid />
            <Text style={styles.ratingText}>{count > 0 ? '4.1' : '0.0'}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item?.name}
          </Text>
          <View style={styles.metaRow}>
            <FontAwesome5 name="bolt" size={10} color={colors.highlightPrimary} />
            <Text style={styles.metaText} numberOfLines={1}>
              Near & Fast
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.pageContainer}>
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
            placeholder="Search for category"
            value={filterValue}
            onChange={e => setFilterValue(e.nativeEvent.text)}
          />
        </View>
      </View>
      <FlatList
        data={filteredCategories}
        keyExtractor={item => item?.uuid}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.listRow}
        showsVerticalScrollIndicator={false}
        renderItem={renderCategoryCard}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No categories found</Text>
            <Text style={styles.emptyText}>Try another search term.</Text>
          </View>
        }
      />
    </View>
  );
};

export default Category;
