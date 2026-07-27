import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
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

const Profile = () => {
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

  useEffect(()=>{
    setStateData(userDetails?.address?.country);
    setCountyData(userDetails?.address?.state);
    setCityData(userDetails?.address?.county);

  },[userDetails])

  useEffect(()=>{
    if(userDetails) {
      const country = COUNTRY.find((val) => userDetails?.address?.country == val.id);
      setSelCountry(country?.title);
    }
  },[userDetails])

  useEffect(()=>{
    if(stateData) {
      const state = stateData.find((val) => userDetails?.address?.state === val.uuid);
      setSelState(state?.name);
    }
  },[stateData])

  useEffect(()=>{
    if(countyData) {
      const county = countyData.find((val) => userDetails?.address?.county === val.uuid);
      setSelCounty(county?.name);
    }
  },[countyData])

  useEffect(()=>{
    if(cityData) {
      const city = cityData.find((val) => userDetails?.address?.city === val.uuid);
      setSelCity(city?.name);
    }
  },[cityData])

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={{
        alignItems: 'center',
      }}>
      <View style={{marginBottom: 30}}>
        <Grid gap={20} dir="column">
          <Text style={styles.header}>My Profile</Text>
          <View style={{position:'relative', left: '15%', height: '8%', marginTop: 10, alignItems: 'center'}}>
          <Avatar
            src={userDetails?.src}
            flatStyle
            rounded
            size={150}
            userDetails={userDetails}

          />
          </View>
          <Grid
            gap={10}
            dir="column"
            containerStyles={styles.readOnlyFormContainer}>
            <View style={styles.detailsItem} key={1}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.firstName}
              </Text>
            </View>
            <View style={styles.detailsItem} key={2}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.lastName}
              </Text>
            </View>
            <View style={styles.detailsItem} key={3}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.mobile}
              </Text>
            </View>
            <View style={styles.detailsItem} key={4}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.primaryEmail}
              </Text>
            </View>
            <View style={styles.detailsItem} key={5}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.address?.location}
              </Text>
              <FontAwesomeIcon
                name={'map-marker'}
                size={15}
                color={themeColors.fontPrimary}
              />
            </View>
            <View style={styles.detailsItem} key={6}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.address?.addressLine1}
              </Text>
              <FontAwesomeIcon
                name={'map-marker'}
                size={15}
                color={themeColors.fontPrimary}
              />
            </View>
            <View style={styles.detailsItem} key={7}>
              <Text style={styles.detailsItemInfo}>
                {selCountry || userDetails?.address?.country}
              </Text>
            </View>
            <View style={styles.detailsItem} key={8}>
              <Text style={styles.detailsItemInfo}>
                {selState || userDetails?.address?.state}
              </Text>
            </View>
            <View style={styles.detailsItem} key={9}>
              <Text style={styles.detailsItemInfo}>
                {selCounty || userDetails?.address?.county}
              </Text>
            </View>
            <View style={styles.detailsItem} key={10}>
              <Text style={styles.detailsItemInfo}>
                {selCity || userDetails?.address?.city}
              </Text>
            </View>
            <View style={styles.detailsItem} key={11}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.address?.apartmentNo}
              </Text>
            </View>
            <View style={styles.detailsItem} key={12}>
              <Text style={styles.detailsItemInfo}>
                {zipFormat(userDetails?.address?.zip)}
              </Text>
            </View>
            <View style={styles.detailsItem} key={13}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.demographics?.race}
              </Text>
            </View>
            <View style={styles.detailsItem} key={14}>
              <Text style={styles.detailsItemInfo}>
                {moment(userDetails?.demographics?.dob).format('DD-MM-YYYY')}
              </Text>
              <FontAwesomeIcon
                name={'calendar'}
                size={15}
                color={themeColors.fontPrimary}
              />
            </View>
            <View style={styles.detailsItem} key={15}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.gender}
              </Text>
            </View>
            <View style={styles.detailsItem} key={15}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.address?.landmark}
              </Text>
            </View>
            <View style={styles.detailsItem} key={15}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.ssn}
              </Text>
            </View>
            <View style={styles.detailsItem} key={15}>
              <Text style={styles.detailsItemInfo}>
                {userDetails?.id_number}
              </Text>
            </View>
          </Grid>
        </Grid>
      </View>
    </ScrollView>
  );
};

export default Profile;
