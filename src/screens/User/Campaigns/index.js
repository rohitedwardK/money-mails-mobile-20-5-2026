import React from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Text, View} from 'react-native';
import getColors from '../../../utils/colors';
import {getCollection, useCampaigns} from '../../../hooks/useCampaignQueries';
import CampaignCard from './CampaignCard';
import {styles as campaignStyles} from './index.style';
import {getCampaignUuid} from './utils';

const Campaigns = ({navigation}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const {data, isLoading, isFetching, refetch, error} = useCampaigns();
  const campaigns = getCollection(data);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.stateBox]}>
        <ActivityIndicator color={themeColors.highlightPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={campaigns}
        keyExtractor={(item, index) => getCampaignUuid(item) || `${index}`}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={themeColors.highlightPrimary}
          />
        }
        renderItem={({item}) => (
          <CampaignCard
            campaign={item}
            onPress={() => navigation.navigate('CampaignDetail', {campaignUuid: getCampaignUuid(item)})}
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
