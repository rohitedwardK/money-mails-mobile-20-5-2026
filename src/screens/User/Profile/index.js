import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {TextInput} from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Avatar from '../../../components/atoms/Avatar';
import Grid from '../../../components/atoms/Grid';
import {COUNTRY} from '../../../constants';
import {UserContext} from '../../../context/UserContext';
import {useCityData} from '../../../hooks/services/useCityData';
import {useCountyData} from '../../../hooks/services/useCountyData';
import {useStateData} from '../../../hooks/services/useStateData';
import getColors from '../../../utils/colors';
import {myProfileScreenStyles} from './index.style';

const asList = value => {
  if (Array.isArray(value)) return value.join(', ');
  return value || '';
};

const formatDate = value => {
  if (!value) return '';
  const date = moment(value);
  return date.isValid() ? date.format('DD-MM-YYYY') : String(value);
};

const ProfileField = ({label, value, style, colors}) => (
  <TextInput
    label={label}
    placeholder={label}
    value={String(value || '')}
    placeholderTextColor={colors.fontMuted}
    textColor={colors.fontPrimary}
    outlineColor={colors.borderPrimary}
    activeOutlineColor={colors.highlightPrimary}
    editable={false}
    mode="outlined"
    style={style}
  />
);

const Profile = ({navigation}) => {
  const styles = myProfileScreenStyles();
  const {themeColors: colors} = getColors();
  const {userDetails} = useContext(UserContext);
  const address = userDetails?.address || {};
  const demographics = userDetails?.demographics || {};
  const [selCountry, setSelCountry] = useState('');
  const [selState, setSelState] = useState('');
  const [selCounty, setSelCounty] = useState('');
  const [selCity, setSelCity] = useState('');
  const {stateData, setStateData} = useStateData();
  const {countyData, setCountyData} = useCountyData();
  const {cityData, setCityData} = useCityData();

  useEffect(() => {
    if (address.country) setStateData(address.country);
    if (address.state) setCountyData(address.state);
    if (address.county) setCityData(address.county);
  }, [address.country, address.county, address.state, setCityData, setCountyData, setStateData]);

  useEffect(() => {
    const country = COUNTRY.find(item => address.country === item.id);
    setSelCountry(country?.title || address.country || '');
  }, [address.country]);

  useEffect(() => {
    const state = stateData?.find(item => address.state === item.uuid);
    setSelState(state?.name || address.state || '');
  }, [address.state, stateData]);

  useEffect(() => {
    const county = countyData?.find(item => address.county === item.uuid);
    setSelCounty(county?.name || address.county || '');
  }, [address.county, countyData]);

  useEffect(() => {
    const city = cityData?.find(item => address.city === item.uuid);
    setSelCity(city?.name || address.city || '');
  }, [address.city, cityData]);

  const profileFields = [
    ['First Name', userDetails?.firstName],
    ['Last Name', userDetails?.lastName],
    ['Phone', userDetails?.mobile || userDetails?.phone?.value],
    ['Primary Email', userDetails?.primaryEmail || userDetails?.email],
    ['Address Line 1', address.location],
    ['Address Line 2', address.addressLine1],
    ['Country', selCountry],
    ['State', selState],
    ['County', selCounty],
    ['City', selCity],
    ['House No', address.apartmentNo],
    ['ZIP Code', address.zip],
    ['Landmark/Housing Community', address.landmark],
    ['Race/Ethnicity', demographics.race || userDetails?.ethnicity],
    ['Date of Birth', formatDate(demographics.dob || userDetails?.dob)],
    ['Religion', userDetails?.religion],
    ['Interests', asList(userDetails?.interests || userDetails?.intrests)],
    ['Languages', asList(userDetails?.languages)],
  ];

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={{
        alignItems: 'center',
      }}>
      <View style={{marginBottom: 30}}>
        <Grid gap={20} dir="column">
          <Text style={styles.header}>My Profile</Text>
          <View
            style={{
              alignItems: 'center',
              height: '8%',
              marginTop: 10,
              position: 'relative',
            }}>
            <Avatar
              src={userDetails?.avatar}
              flatStyle
              rounded
              size={100}
              userDetails={userDetails}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('CompleteInfo')}>
              <FontAwesomeIcon name="pencil-square-o" size={22} color={colors.highlightPrimary} />
            </TouchableOpacity>
          </View>

          <Grid
            gap={10}
            dir="column"
            containerStyles={styles.readOnlyFormContainer}>
            {profileFields.map(([label, value]) => (
              <ProfileField
                key={label}
                label={label}
                value={value}
                colors={colors}
                style={styles.detailsItemNew}
              />
            ))}
          </Grid>
        </Grid>
      </View>
    </ScrollView>
  );
};

export default Profile;
