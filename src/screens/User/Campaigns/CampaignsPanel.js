import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import getColors from '../../../utils/colors';
import {getCollection, useActiveCampaigns} from '../../../hooks/useCampaignQueries';
import CampaignsCarousel from './CampaignsCarousel';
import {styles as campaignStyles} from './index.style';

const CampaignsPanel = ({navigation}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const {data, isLoading, error} = useActiveCampaigns({limit: 5});
  const campaigns = getCollection(data).slice(0, 5);

  if (!isLoading && (error || campaigns.length === 0)) {
    return null;
  }

  return (
    <View style={styles.homePanel}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionTitle}>Ongoing campaigns</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Campaigns')}
            accessibilityRole="button"
            accessibilityLabel="See all campaigns">
            <Text style={styles.sectionSubtitle}>See all</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.panel}>
          <ActivityIndicator color={themeColors.highlightPrimary} />
        </View>
      ) : (
        <CampaignsCarousel
          campaigns={campaigns}
          onOpenCampaign={campaignUuid =>
            navigation.navigate('CampaignDetail', {campaignUuid})
          }
        />
      )}
    </View>
  );
};

export default CampaignsPanel;
