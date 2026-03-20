import React from 'react';
import {View, Image, Text} from 'react-native';
import {avatarStyles} from './index.style';

const Avatar = ({size = 88, rounded, src, fit = 'contain', flatStyle, userDetails}) => {
  const styles = avatarStyles({size, rounded, fit, flatStyle});

  return (
    <View style={styles.wrapper}>
      {src ? <Image style={styles.dp} source={{uri:`${src}`}} /> : <Text style={styles.initial}>{`${userDetails?.firstName?.substring(
          0,
          1
        )}${userDetails?.lastName?.substring(0, 1)}`}</Text>}
      {!flatStyle && <View style={styles.statusIndicator} />}
    </View>
  );
};

export default Avatar;
