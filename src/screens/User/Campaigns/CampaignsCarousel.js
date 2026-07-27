import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import CampaignCard from './CampaignCard';
import {styles as campaignStyles} from './index.style';
import {getCampaignUuid} from './utils';

const AUTOPLAY_MS = 4000;

const CampaignsCarousel = ({campaigns, onOpenCampaign}) => {
  const styles = campaignStyles();
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const canLoop = campaigns.length > 1;

  useEffect(() => {
    setActiveIndex(0);
    listRef.current?.scrollToOffset({offset: 0, animated: false});
  }, [campaigns.length]);

  useEffect(() => {
    if (!canLoop) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex(current => {
        const next = (current + 1) % campaigns.length;
        listRef.current?.scrollToIndex({index: next, animated: true});
        return next;
      });
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [campaigns.length, canLoop]);

  const onMomentumScrollEnd = event => {
    const width = event.nativeEvent.layoutMeasurement.width;
    if (!width) {
      return;
    }
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.max(0, Math.min(nextIndex, campaigns.length - 1)));
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={campaigns}
        contentContainerStyle={styles.horizontalList}
        renderItem={({item}) => (
          <CampaignCard
            compact
            campaign={item}
            onPress={() => onOpenCampaign(getCampaignUuid(item))}
          />
        )}
        keyExtractor={(item, index) => getCampaignUuid(item) || `${index}`}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: styles.compactCard.width,
          offset: styles.compactCard.width * index,
          index,
        })}
        onScrollToIndexFailed={({index}) => {
          listRef.current?.scrollToOffset({
            offset: styles.compactCard.width * index,
            animated: true,
          });
        }}
      />
      {canLoop && (
        <View style={styles.carouselDots}>
          {campaigns.map((campaign, index) => (
            <View
              key={getCampaignUuid(campaign) || `${index}`}
              style={[styles.carouselDot, activeIndex === index ? styles.carouselDotActive : null]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CampaignsCarousel;
