import {StyleSheet} from 'react-native';

export const gridStyles = ({containerStyles, fontStrong, size}) => {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: dir,
      justifyContent: justify,
      alignItems: items,
      width: '100%',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...containerStyles,
    },
  });
};
