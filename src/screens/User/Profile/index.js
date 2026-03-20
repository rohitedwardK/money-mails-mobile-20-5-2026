import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, BackHandler } from 'react-native';
import moment from 'moment';
import Avatar from '../../../components/atoms/Avatar';
import Grid from '../../../components/atoms/Grid';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { myProfileScreenStyles } from './index.style';
import getColors from '../../../utils/colors';
import { UserContext } from "../../../context/UserContext";
import { zipFormat } from "../../../utils";
import { useStateData } from "../../../hooks/services/useStateData";
import { useCountyData } from "../../../hooks/services/useCountyData";
import { useCityData } from "../../../hooks/services/useCityData";
import { COUNTRY } from "../../../constants";
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {
  const styles = myProfileScreenStyles();
  const { userDetails } = useContext(UserContext);
  const { themeColors } = getColors();
  const [selCountry, setSelCountry] = useState();
  const [selState, setSelState] = useState();
  const [selCounty, setSelCounty] = useState();
  const [selCity, setSelCity] = useState();
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();


  useEffect(() => {
    setStateData(userDetails?.address?.country);
    setCountyData(userDetails?.address?.state);
    setCityData(userDetails?.address?.county);
  }, [userDetails])

  // BackHandler
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate('User', {
          screen: 'Home',
        });
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );




  useEffect(() => {
    if (userDetails) {
      const country = COUNTRY.find((val) => userDetails?.address?.country == val.id);
      setSelCountry(country?.title);
    }
  }, [userDetails])

  useEffect(() => {
    if (stateData) {
      const state = stateData.find((val) => userDetails?.address?.state === val.uuid);
      setSelState(state?.name);
    }
  }, [stateData])

  useEffect(() => {
    if (countyData) {
      const county = countyData.find((val) => userDetails?.address?.county === val.uuid);
      setSelCounty(county?.name);
    }
  }, [countyData])

  useEffect(() => {
    if (cityData) {
      const city = cityData.find((val) => userDetails?.address?.city === val.uuid);
      setSelCity(city?.name);
    }
  }, [cityData])

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={{
        alignItems: 'center',
      }}>
      <View style={{ marginBottom: 30 }}>
        <Grid gap={20} dir="column">
          <Text style={styles.header}>My Profile</Text>
          <View style={{ position: 'relative', height: '8%', marginTop: 10, alignItems: 'center' }}>
            <Avatar
              src={userDetails?.avatar}
              flatStyle
              rounded
              size={100}
              userDetails={userDetails}

            />
          </View>
          <View style={{ alignItems: 'center' }} >
            <TouchableOpacity onPress={() =>
              navigation.navigate('CompleteInfo')
            }>
              <FontAwesomeIcon name="pencil-square-o" size={20} color={"black"} />
            </TouchableOpacity>
          </View>

          <Grid
            gap={10}
            dir="column"
            containerStyles={styles.readOnlyFormContainer}>

            <TextInput
              label="First Name"
              placeholder="Enter First Name"
              value={userDetails?.firstName}
              placeholderTextColor={"black"}
              editable={false}
              style={[styles.detailsItemNew, { color: '#222' }]}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter Last Name"
              value={userDetails?.lastName}
              placeholderTextColor={"black"}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Mobile"
              placeholder="Mobile"
              value={userDetails?.mobile}
              placeholderTextColor={"black"}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Email"
              placeholder="EMail"
              value={userDetails?.primaryEmail}
              placeholderTextColor={"black"}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Address"
              placeholder="Address"
              value={userDetails?.address?.location}
              right={<TextInput.Icon icon="map-marker" color={'black'} />}
              placeholderTextColor={"black"}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Address Line1"
              placeholder='Address Line1'
              value={userDetails?.address?.addressLine1}
              placeholderTextColor={"black"}
              right={<TextInput.Icon icon="map-marker" color={'black'} />}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Country"
              placeholder='Country'
              placeholderTextColor={"black"}
              value={selCountry || userDetails?.address?.country}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="State"
              placeholder='State'
              placeholderTextColor={"black"}
              value={selState || userDetails?.address?.state}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="County"
              placeholder='County'
              placeholderTextColor={"black"}
              value={selCounty || userDetails?.address?.county}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="City"
              placeholder='City'
              placeholderTextColor={"black"}
              value={selCity || userDetails?.address?.city}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Appartment No."
              placeholder='Appartment No.'
              placeholderTextColor={"black"}
              value={userDetails?.address?.apartmentNo}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Landmark"
              placeholder='Landmark'
              placeholderTextColor={"black"}
              value={userDetails?.address?.landmark}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Zip Code"
              placeholder='Zip Code'
              placeholderTextColor={"black"}
              value={userDetails?.address?.zip}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="SSN."
              placeholder='SSN.'
              placeholderTextColor={"black"}
              value={userDetails?.ssn}
              editable={false}
              style={styles.detailsItemNew}
            />

            <TextInput
              label="Race / Ethincity"
              placeholder='Race / Ethincity'
              placeholderTextColor={"black"}
              value={userDetails?.demographics?.race}
              editable={false}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="D-O-B"
              placeholder='D-O-B'
              placeholderTextColor={"black"}
              value={moment(userDetails?.demographics?.dob).format('DD-MM-YYYY')}
              editable={false}
              right={<TextInput.Icon icon="calendar-month" color={'black'} />}
              style={styles.detailsItemNew}
            />
            <TextInput
              label="Gender"
              placeholder='Gender'
              placeholderTextColor={"black"}
              value={userDetails?.gender}
              editable={false}
              style={styles.detailsItemNew}
            />

            <TextInput
              label="ID Number"
              placeholder='ID Number'
              placeholderTextColor={"black"}
              value={userDetails?.id_number}
              editable={false}
              style={styles.detailsItemNew}
            />
          </Grid>
        </Grid>
      </View>
    </ScrollView>
  );
};

export default Profile;
