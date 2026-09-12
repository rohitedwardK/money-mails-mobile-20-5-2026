import React, {useContext, useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Button from '../../../components/atoms/Button';
import BrandLogo from '../../../assets/images/brandLogo.js';
import GetStartedIllustration from '../../../assets/images/getStartedIllustration.js';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as getStartedStyles} from './index.style';
import {getAuthToken} from '../../../utils/secureStorage';



const GetStarted = ({navigation}) => {
  const { screenWidth, screenHeight } = useContext(DeviceContext);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const styles = getStartedStyles();


  const checkAuthentication = async () => {
    const userToken = await getAuthToken();
    if (userToken) {
      setAuth(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuthentication();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (auth) {
      navigation.navigate('UserScreens');
    }
  }, [auth, navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />; // or return a loading indicator
  }

  if (auth) {
    return null; // Prevent rendering anything else if already redirected
  }

  return (
  <View style={styles.pageContainer}>
      <BrandLogo height={75} scale={5} />
      <View style={styles.carousalContainer}>
        <Carousel
          loop
          width={screenWidth - 70}
          height={screenHeight * 0.376}
          autoPlay={true}
          data={[...new Array(6).keys()]}
          scrollAnimationDuration={3000}
          renderItem={() => (
            <View style={styles.illustrationView}>
              <GetStartedIllustration />
            </View>
          )}
        />
      </View>
      <Button
        btnText="GET STARTED"
        variant="primary"
        fontStrong
        size="large"
        overridingStyles={styles.getStartedBtn}
        onPress={() => navigation.navigate('SignIn')}
      />
      <Button
      btnTextOverrideStyles={{
        color: '#0E6655',
      }}
        btnText="Sign Up"
        type="link"
        linkpreText="Don't have an account?"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>

  );


};

export default GetStarted;
