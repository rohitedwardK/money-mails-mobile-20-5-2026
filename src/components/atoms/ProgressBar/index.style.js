import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const progressBarStyles = ({progressBar}) => {
  const {ProgressBarColors} = getColors();

  return StyleSheet.create({
    wrapper: {
      marginHorizontal: 5,
      width: '98%',
      height: 28,
      borderRadius: 30,
      position: 'relative',
    },
    highlight: {
      position: 'absolute',
      width: `${progressBar > 100 ? 90 - 6 : progressBar - 6}%`,
      backgroundColor: ProgressBarColors?.progressHighlight,
      height: 8,
      borderRadius: 30,
      top: 0,
      left: 0,
    },
    track: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      borderRadius: 30,
      backgroundColor: ProgressBarColors?.progressBG,
    },
    text: {
      position: 'absolute',
      top: 12,
      left: 0,
      color: ProgressBarColors?.progressHighlight,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700',
    },
  });
};
