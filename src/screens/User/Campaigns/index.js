import React, {useContext, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../../../context/UserContext';
import getColors from '../../../utils/colors';
import {getCollection, useCampaigns} from '../../../hooks/useCampaignQueries';
import CampaignCard from './CampaignCard';
import {styles as campaignStyles} from './index.style';
import {CAMPAIGN_STATUS, filterCampaignsByStatus, getCampaignUuid} from './utils';

const FILTERS = [
  {key: 'ALL', label: 'All'},
  {key: CAMPAIGN_STATUS.AVAILABLE, label: 'Available'},
  {key: CAMPAIGN_STATUS.RESERVED, label: 'Reserved'},
  {key: CAMPAIGN_STATUS.REDEEMED, label: 'Booked'},
];

const getInitials = userDetails => {
  const firstName = String(userDetails?.firstName || '').trim();
  const lastName = String(userDetails?.lastName || '').trim();
  const email = String(userDetails?.email || '').trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return (initials || email.charAt(0) || 'U').toUpperCase();
};

const CampaignsHeader = ({navigation, userDetails}) => {
  const styles = campaignStyles();

  return (
    <View style={styles.campaignsHeader}>
      <View style={styles.campaignsHeaderCopy}>
        <Text style={styles.campaignsHeaderTitle}>Campaigns</Text>
        <Text style={styles.campaignsHeaderSubtitle}>Claim a spot before tickets run out</Text>
      </View>
      <View style={styles.campaignsHeaderActions}>
        <TouchableOpacity
          style={styles.campaignsHeaderIcon}
          onPress={() => navigation.navigate('Notification')}
          accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color="#111827" />
          <View style={styles.campaignsHeaderDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.campaignsHeaderAvatar}
          onPress={() => navigation.navigate('AccountMenu')}
          accessibilityLabel="Profile">
          <Text style={styles.campaignsHeaderAvatarText}>{getInitials(userDetails)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Campaigns = ({navigation}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const {userDetails} = useContext(UserContext);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const {data, isLoading, isFetching, refetch, error} = useCampaigns();
  const campaigns = getCollection(data);
  const filteredCampaigns = useMemo(
    () => filterCampaignsByStatus(campaigns, activeFilter),
    [campaigns, activeFilter],
  );

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.screenSurface, styles.stateBox]}>
        <ActivityIndicator color={themeColors.highlightPrimary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, styles.screenSurface]}>
      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item, index) => getCampaignUuid(item) || `${index}`}
        contentContainerStyle={styles.campaignsListContent}
        ListHeaderComponent={
          <>
            <CampaignsHeader navigation={navigation} userDetails={userDetails} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}>
              {FILTERS.map(filter => {
                const isActive = activeFilter === filter.key;
                return (
                  <TouchableOpacity
                    key={filter.key}
                    activeOpacity={0.85}
                    style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
                    onPress={() => setActiveFilter(filter.key)}>
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.filterChipTextActive : null,
                      ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={themeColors.highlightPrimary}
          />
        }
        renderItem={({item}) => (
          <CampaignCard
            variant="list"
            campaign={item}
            onPress={() =>
              navigation.navigate('CampaignDetail', {campaignUuid: getCampaignUuid(item)})
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>
              {error ? 'Campaigns are unavailable' : 'No campaigns found'}
            </Text>
            <Text style={styles.stateText}>
              {error?.message || 'New ticket campaigns will appear here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Campaigns;
