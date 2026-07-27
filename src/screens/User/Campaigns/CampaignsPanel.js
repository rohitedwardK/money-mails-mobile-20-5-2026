import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionTitle}>Ongoing Campaigns</Text>
          <Text style={styles.sectionSubtitle}>Claim your spot</Text>
        </View>
        <View style={styles.sectionActions}>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={() => navigation.navigate('CampaignTicketHistory')}>
            <Ionicons name={'ticket-outline'} size={15} color={themeColors.fontMuted} />
            <Text style={styles.sectionLink}>My Bookings</Text>
          </TouchableOpacity>
          <View style={styles.sectionActionDivider} />
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={() => navigation.navigate('Campaigns')}>
            <Ionicons name={'megaphone-outline'} size={15} color={themeColors.fontMuted} />
            <Text style={styles.sectionLink}>All Campaigns</Text>
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
