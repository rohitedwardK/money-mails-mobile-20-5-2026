import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Octicon from 'react-native-vector-icons/Octicons';
import { DeviceContext } from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';
import Button from '../../atoms/Button';
import { appBarStyles } from './index.style';
import { UserContext } from "../../../context/UserContext";
import StoriesScreen from '../../../screens/User/Home/stories';

const AppHeader = ({ logoComponent, onMenuPress, onLocationPress }) => {
  const { location, userDetails } = useContext(UserContext);
  const { isAndroid } = useContext(DeviceContext);
  const { container, notificationIcon, brand } = appBarStyles({ isAndroid });
  const { themeColors: colors } = getColors();
  const [city, setCity] = useState(location.city?.uuid);

  useEffect(() => {
    // alert(JSON.stringify(userDetails))
    // if(userDetails?.city== 0) setCity(userDetails.cities[0].name)
    setCity(userDetails.city);
  }, [])

  return (
    <View style={container}>
      <Button
        type="text"
        btnText=''
        overridingStyles={{
          width: 30,
          paddingHorizontal: 0,
        }}
        startIcon={<EntypoIcon name="menu" size={30} color={colors.accent} />}
        onPress={onMenuPress}
      />
      {logoComponent ? (
        <logoComponent />
      ) : (
        <Image
          style={brand}
          source={require('../../../assets/images/brand.png')}
        />
      )}
      {/* <StoriesScreen /> */}
      <View style={{
        // display:'flex',
        // justifyContent : 'flex-end',
        // alignSelf : 'flex-end',
        // alignItems : 'flex-end'
      }}>
        {userDetails?.uuid && userDetails?.token &&
          <StoriesScreen userId={userDetails?.uuid} userToken={userDetails?.token} />
        }
      </View>
      {/* <Button
        type="text"
        btnText=''
        overridingStyles={{
          width: 30,
          height: 'auto',
          paddingHorizontal: 0,
          marginLeft: 'auto'
        }}
        startIcon={<EntypoIcon name="location" size={30} color={colors.accent} />}
        onPress={onLocationPress}
      /> */}
      {/* <Button
        type="text"
        btnText={city}
        overridingStyles={{
          width: 30,
          height: 'auto',
          paddingHorizontal: 0,
          marginLeft: 'auto'
        }}
        startIcon={<EntypoIcon name="location" size={30} color={colors.accent} />}

      /> */}
      {/* <Text style={{width: 'auto',
          height: 'auto',
          color : colors.accent,
          paddingHorizontal: 0,
          marginLeft: 'auto'}}>{city}</Text> */}

    </View>
  );
};

export default AppHeader;
