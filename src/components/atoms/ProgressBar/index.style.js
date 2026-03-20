import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const progressBarStyles = ({progressBar}) => {
  const {ProgressBarColors} = getColors();

  return StyleSheet.create({
    wrapper: {
      marginHorizontal: 5,
      width: '98%',
      backgroundColor: ProgressBarColors?.progressBG,
      height: 8,
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
    text: {
      position: 'absolute',
      top: 9,
      left: `${progressBar > 100 ? 90 - 6 : progressBar - 6}%`,
      color: ProgressBarColors?.progressHighlight,
      fontSize: 12,
    },
  });
};
