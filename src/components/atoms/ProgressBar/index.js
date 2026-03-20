import React from 'react';
import {View, Text} from 'react-native';
import {progressBarStyles} from './index.style';

const ProgressBar = ({progress = 0}) => {
  const progressBar = progress !== 0 ? Math.round(progress/10) : 0;
  const styles = progressBarStyles({progressBar});

  return (
    <View style={styles.wrapper}>
      <View style={styles.highlight} />
      <Text style={styles.text}>{`${progress} Points`}</Text>
    </View>
  );
};

export default ProgressBar;
