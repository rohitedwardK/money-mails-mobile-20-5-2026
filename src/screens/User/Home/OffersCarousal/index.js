import React, {useContext} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import {View, ActivityIndicator, Image} from 'react-native';
import {DeviceContext} from '../../../../context/DeviceContext';
import {styles as OffersCarousalStyles} from './index.style';

export const OfferImage = ({index, source}) => {
  const styles = OffersCarousalStyles();
  return (
    <View style={[styles.imageCardContainer]}>
      <ActivityIndicator size="small" />
      <Image
        resizeMode="cover"
        key={index}
        style={styles.image}
        source={{uri: `${source}`}}
      />
    </View>
  );
};

export const OfferImageCardItem = props => {
  const {index, source} = props;
  const styles = OffersCarousalStyles();

  return (
    <LongPressGestureHandler>
      <Animated.View style={styles.animatedView}>
        <OfferImage index={index} source={source} />
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const OffersCarousal = ({data}) => {
  const {screenWidth} = useContext(DeviceContext);
  const progressValue = useSharedValue(0);
  const baseOptions = {
    vertical: false,
    width: screenWidth,
    height: 148,
  };

  return (
    <Carousel
      {...baseOptions}
      loop
      autoPlay
      autoPlayInterval={1500}
      onProgressChange={(_, absoluteProgress) =>
        (progressValue.value = absoluteProgress)
      }
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
      }}
      data={data}
      renderItem={({index}) => <OfferImageCardItem index={index} source={data[index]?.image} />}
    />
  );
};

export default OffersCarousal;
