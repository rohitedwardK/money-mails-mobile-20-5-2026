import {StyleSheet , Dimensions} from 'react-native';
import getColors from '../../../utils/colors';

export const offerCardStyles = ({size, maxSize, containerStyles={}}) => {
  const {themeColors: colors, isDarkMode} = getColors();

  const defaultSize =  Dimensions.get('window').width / 2.5;
  const defaultHeight = 175;
  const cardSize = size || defaultSize;
  const maxDimensions = maxSize || cardSize;

  return StyleSheet.create({
    container: {
      backgroundColor: containerStyles?.backgroundColor || colors.bgPrimary,
      width: cardSize,
      height: defaultHeight,//cardSize,
      borderRadius: 5,
      maxWidth: maxDimensions,
      maxHeight: defaultHeight, //maxDimensions,
      borderWidth: 0.5,
      margin:2,
      borderColor: colors.borderPrimary,
    },
    wrapper: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardHeaderWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    offerTitleWrapper: {
      paddingTop: 5,
    },
    offerTitle: {
      color: colors.fontPrimary,
    },
    offerSubText: {
      color: '#7D7D7D',
      fontSize: 12,
    },
    cardFooterText: {
      fontSize: 13,
      color: '#7D7D7D',
    },
    redeemTag: {
      backgroundColor: '#d4d4d4',
      color: '#676767',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 4,
      marginTop: 15,
    },
  });
};
