import React, { useEffect, useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StatusBar from '../../components/atoms/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Home';
import Category from './Category';
import Favourites from './Favourites';
import Rewards from './Rewards';
import Stores from './Stores';
import Profile from './Profile';
import Mails from './Mails';
import Bingo from './Bingo';
import Notification from './Notifications';
import AppHeader from '../../components/molecules/AppHeader';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import getColors from '../../utils/colors';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { Text, TouchableHighlight, TouchableOpacity, View, Alert } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Octicon from 'react-native-vector-icons/Octicons';
import Drawer from '../../components/organisms/Drawer';
import Avatar from '../../components/atoms/Avatar';
import Button from '../../components/atoms/Button';
import { useNavigation } from '@react-navigation/native';
import ModalDialog from '../../components/organisms/Dialog';
import { useLogin } from "../../hooks/services/useLogin";
import { UserContext } from "../../context/UserContext";
import { styles } from './index.style';
import { COUNTRY } from "../../constants";
import { useStateData } from "../../hooks/services/useStateData";
import { useCountyData } from "../../hooks/services/useCountyData";
import { useCityData } from "../../hooks/services/useCityData";
import PointRedeemHistory from './PointRedeemHistory';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNotification } from '../../hooks/services/useNotification';
import Snackbar from 'react-native-snackbar';
import { baseUrl } from "../../connections";

// User Complete Profile
import CompleteInfo from './profileComplete/completeInfo';
import ProfileSetting from './profileComplete/ProfileSetting';
import PersonalizationDetails from './profileComplete/PersonalizationDetails';
import AddressDetails from './profileComplete/AddressDetails';
import VerificationInformation from './profileComplete/VerificationInformation';
import colors from '../../utils/colors';

// New Static Screens
import Terms from './Terms';
import Privacy from './Privacy';
import About from './About';
import Faq from './Faq';
import PopupAds from './PopupAds';
import Support from './Support';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



const tabBarIconMap = {
  Home: 'home',
  Category: 'list',
  Store: 'price-tag',
  Mails: 'mail',
  Favourites: 'heart',
  Rewards: 'star',
  Profile: 'user',
  Bingo: 'game-controller',
  PointRedeemHistory: 'book',
  Notification: 'bell'
};

const UserHome = () => {
  const { themeColors: colors } = getColors();
  const { userDetails, setUserDetails, setLocation } = useContext(UserContext);
  const { data, setNotificationPayload, count } = useNotification();
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selCountry, setSelCountry] = useState();
  const [selState, setSelState] = useState();
  const [selCounty, setSelCounty] = useState();
  const [selCity, setSelCity] = useState();
  const navigation = useNavigation();
  const { setData } = useLogin();
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setNotificationPayload({ user_uuid: userDetails?.uuid, page: 0, key: Math.random(5) });
    }, 5000)
  }, [])

  const headerOptions = {
    headerTitleStyle: {
      color: colors.fontPrimary,
    },
    headerStyle: {
      backgroundColor: colors.bgPrimary,
    },
    statusBarColor: colors.statusbarUserPrimaryColor,
    headerTitleAlign: 'left',
    headerLeft: () => (
      <TouchableOpacity >
        <EvilIcon
          name="chevron-left"
          size={40}
          color={colors.accent}
          onPress={() => {
            navigation.navigate('Home')
          }}
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity>
        <></>
        {/* <Octicon
          style={{
            marginRight: 12,
          }}
          name="bell-fill"
          size={20}
          color={colors.accent}
        /> */}
      </TouchableOpacity>
    ),
  };

  const logoutHandlerAlert = async () => {
    Alert.alert('Alert', 'Are you sure wants to Logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => logoutHandler() },
    ]);
  }

  const deleteAccountHandlerAlert = async () => {
    Alert.alert('Alert', 'Are you sure wants to Delete Account?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => deleteAccountHandler() },
    ]);
  }


  const deleteAccountHandler = async () => {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);
      const requestOptions = {
        method: "DELETE",
        headers: headers,
        redirect: "follow",
      };

      fetch(`${baseUrl}/user/delete/account/${userDetails?.uuid}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then(async (result) => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("auth");
          await AsyncStorage.removeItem("user");
          await AsyncStorage.clear();
          setData({});
          setUserDetails({});
          setOpenDrawer(false);
          Snackbar.show({
            text: 'Account Deleted Successfully.',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('SignIn');
        })
        .catch((err) => {
          Alert.alert('Alert', 'Something went wrong!')
        });

    }
    catch (exception) {
      return false;
    }
  }

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("auth");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.clear();
      setData({});
      setUserDetails({});
      setOpenDrawer(false);
      Snackbar.show({
        text: 'User Logged Out Successfully.',
        duration: Snackbar.LENGTH_SHORT,
      });
      // navigation.navigate('SignIn');
      navigation.navigate('LoginScreens', { screen: 'SignIn' });
    }
    catch (exception) {
      return false;
    }
  }

  // get state list
  useEffect(() => {
    setStateData('CO-42A82D09');
  }, [])

  // get county list
  useEffect(() => {
    if (userDetails?.address?.state !== '') setCountyData(userDetails?.address?.state);
  }, [userDetails?.address?.state])

  // get city list
  useEffect(() => {
    if (userDetails?.address?.county !== '') setCityData(userDetails?.address?.county);
  }, [userDetails?.address?.county])

  const handleDropdownChange = (id, val) => {
    if (id === 'country') {
      setSelCountry(val);
      setStateData(val?.uuid);
      setSelState('');
    }
    if (id === 'state') {
      setSelState(val);
      setSelCounty('');
      setCountyData(val?.uuid);
    }
    if (id === 'county') {
      setSelCounty(val);
      setSelCity('');
      setCityData(val?.uuid);
    }
    if (id === 'city') setSelCity(val);
  }

  const onCancelHandler = () => {
    setSelCountry('');
    setSelState('');
    setSelCounty('');
    setSelCity('');
    setShowDialog(false)
  }
  const onSubmitHandler = () => {
    const payload = {
      country: selCountry,
      state: selState,
      county: selCounty,
      city: selCity,
    }
    setLocation(payload);
    setShowDialog(false)
  }

  return (
    <View
      style={{
        display: 'flex',
        backgroundColor: colors.bgPrimary,
        flex: 1,
      }}>
      {/* <StatusBar color={colors.statusbarUserPrimaryColor} /> */}
      {/* <AppHeader /> */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route?.name === 'Category') {
              return (
                <EntypoIcon
                  name={tabBarIconMap[route?.name]}
                  size={size}
                  color={color}
                />
              );
            } else if (route?.name === 'Store') {
              return (
                <EntypoIcon
                  name={tabBarIconMap[route?.name]}
                  size={size}
                  color={color}
                />
              );
            } else if (route?.name === 'Bingo') {
              return (
                <EntypoIcon
                  name={tabBarIconMap[route.name]}
                  size={size}
                  color={color}
                />
              );
            } else if (route?.name === 'Notification') {
              return (
                <>
                  <EvilIcon
                    name={tabBarIconMap[route?.name]}
                    size={size}
                    color={color}
                  />
                  <View style={{ marginTop: -30, marginLeft: 20 }}>
                    <View style={{ backgroundColor: '#09A57D', borderRadius: 25 }}>
                      <Text style={{ fontSize: 10, padding: 3, color: '#fff' }}>{count}</Text>
                    </View>
                  </View>
                </>
              );
            } else {
              return (
                <AntIcon
                  name={tabBarIconMap[route?.name]}
                  size={size}
                  color={color}
                />
              );
            }
          },
          tabBarStyle: {
            backgroundColor: colors.bgPrimary,
            paddingBottom: 10
          },
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: 'tomato',
          // headerShown: false,
        })}>
        <Tab.Screen
          name="Home"
          options={{
            headerTitle: props => (
              <AppHeader onMenuPress={() => setOpenDrawer(true)} onLocationPress={() => setShowDialog(true)} />
            ),
            headerStyle: {
              backgroundColor: colors.bgPrimary,
            },
            statusBarColor: colors.statusbarUserPrimaryColor,
          }}
          component={Home}
        />
        <Tab.Screen
          options={({ navigation }) => ({
            ...headerOptions,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <EvilIcon name="chevron-left" size={40} color={colors.accent} />
              </TouchableOpacity>
            ),
          })}
          name="Rewards"
          component={Rewards}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Profile"
          component={Profile}
        />
        <Tab.Screen
          // options={headerOptions}
          options={{
            headerShown: true,
          }}
          name="Bingo"
          component={Bingo}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
        />
      </Tab.Navigator>
      <Drawer open={openDrawer} onClose={setOpenDrawer}>
        <View style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <View>
            <View
              style={{
                backgroundColor: 'rgba(50, 157, 154, 0.8)',
                paddingTop: 70,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 30,
              }}>
              <Avatar
                src={(userDetails?.avatar) ? userDetails?.avatar : require('../../assets/images/dp.jpg')}
                flatStyle
                rounded
                size={70}
                userDetails={userDetails}
              />
              <View
                style={{
                  marginLeft: 40,
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: 'white',
                  }}>
                  {userDetails?.firstName}{'\n'}{userDetails?.lastName}
                </Text>
                <Button
                  type="text"
                  btnText="View Profile"
                  overridingStyles={{
                    width: 70,
                    paddingHorizontal: 0,
                    margin: 0,
                  }}
                  btnTextOverrideStyles={{
                    fontSize: 12,
                    color: '#EBEBEB',
                  }}
                  onPress={() => {
                    setOpenDrawer(false);
                    navigation.navigate('profileDrawer');
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{
            clear: 'both',
            alignItems: 'flex-start'

          }}>
            <View
              style={{
                paddingHorizontal: 10,
                flexDirection: 'column',
                paddingBottom: 30,
              }}>
              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('RewardsDrawer');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon name="star" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Rewards</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Favourites');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon name="heart" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Favourites</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Category');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon
                    name="grid"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Categories</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Store');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon
                    name="price-tag"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Stores</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Mails');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon
                    name="mail"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Mails</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('PointRedeemHistory');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <EntypoIcon
                    name="book"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Point Redeem History</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('PopupAds');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="popup" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Popup Ads</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('About');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="info" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>About Us</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Faq');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="help" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>FAQ</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Privacy');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="shield" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Privacy Policy</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Terms');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="text-document" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Terms & Conditions</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#E1FFFF"
                onPress={() => {
                  setOpenDrawer(false);
                  navigation.navigate('Support');
                }}>
                <View style={{ flexDirection: 'row', padding: 16 }}>
                  <EntypoIcon name="network" size={25} color={'rgba(50, 157, 154, 0.8)'} />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Support</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#fff"
                onPress={deleteAccountHandlerAlert}>
                <View style={{
                  flexDirection: 'row',
                  padding: 16,
                }}>
                  <EntypoIcon
                    name="trash"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Delete Account</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#fff"
                onPress={logoutHandlerAlert}>
                <View style={{
                  flexDirection: 'row',
                  padding: 16,
                }}>
                  <EntypoIcon
                    name="log-out"
                    size={25}
                    color={'rgba(50, 157, 154, 0.8)'}
                  />
                  <Text style={{ paddingLeft: 16, color: '#454545' }}>Logout</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Drawer>
      <ModalDialog
        content={
          <View style={{ paddingBottom: 10 }}>
            <AutocompleteDropdown
              direction={'down'}
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={selCountry}
              onSelectItem={val => handleDropdownChange('country', val)}
              dataSet={COUNTRY}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              textInputProps={{
                placeholder: 'select country'
              }}
              inputContainerStyle={{
                marginTop: 25,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
            />
            <AutocompleteDropdown
              direction={'up'}
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={selState}
              onSelectItem={val => handleDropdownChange('state', val)}
              dataSet={stateData}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              textInputProps={{
                placeholder: 'select state'
              }}
              inputContainerStyle={{
                marginTop: 25,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
            />
            <AutocompleteDropdown
              direction={'up'}
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={selCounty}
              onSelectItem={val => handleDropdownChange('county', val)}
              dataSet={countyData}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              textInputProps={{
                placeholder: 'select county'
              }}
              inputContainerStyle={{
                marginTop: 25,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
            />
            <AutocompleteDropdown
              direction={'up'}
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={selCity}
              onSelectItem={val => handleDropdownChange('city', val)}
              dataSet={cityData}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              textInputProps={{
                placeholder: 'select city'
              }}
              inputContainerStyle={{
                marginTop: 25,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
            />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Button
                btnText="Cancel"
                size="large"
                overridingStyles={{ width: '48%', height: 40 }}
                onPress={onCancelHandler}
              />
              <Button
                btnText="Submit"
                size="large"
                overridingStyles={{ width: '48%', height: 40 }}
                onPress={onSubmitHandler}
              />
            </View>
          </View>
        }
        open={showDialog}
        onDismiss={() => setShowDialog(false)}
      />
    </View>
  );
};


const UserScreens = () => {
  return (
    <Stack.Navigator
      // initialRouteName="User"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          title: ''
        }}
        name='User'
        component={UserHome}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Point Redeem History'
        }}
        name='PointRedeemHistory'
        component={PointRedeemHistory}
      />
      {/* Profile Complete Info */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profile Completion'
        }}
        name='CompleteInfo'
        component={CompleteInfo}
      />
      <Stack.Screen

        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Profile Setting'
        }}
        name='ProfileSetting'
        component={ProfileSetting}
      />
      <Stack.Screen

        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Personalization Details'
        }}
        name='PersonalizationDetails'
        component={PersonalizationDetails}
      />
      <Stack.Screen

        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Address Details'
        }}
        name='AddressDetails'
        component={AddressDetails}
      />
      <Stack.Screen

        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Verification Informations'
        }}
        name='VerificationInformation'
        component={VerificationInformation}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name="Category"
        component={Category}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name='Mails'
        component={Mails}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name='RewardsDrawer'
        component={Rewards}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name='profileDrawer'
        component={Profile}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name="Favourites"
        component={Favourites}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name="Store"
        component={Stores}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Terms & Conditions'
        }}
        name='Terms'
        component={Terms}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Privacy Policy'
        }}
        name='Privacy'
        component={Privacy}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'About Us'
        }}
        name='About'
        component={About}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'FAQ'
        }}
        name='Faq'
        component={Faq}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Popup Ads'
        }}
        name='PopupAds'
        component={PopupAds}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Support'
        }}
        name='Support'
        component={Support}
      />
    </Stack.Navigator>
  )
}

export default UserScreens;
