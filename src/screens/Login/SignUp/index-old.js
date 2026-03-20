import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, Keyboard, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import Avatar from '../../../components/atoms/Avatar';
import Grid from '../../../components/atoms/Grid';
import { signupScreenStyles } from './index.style';
import TextField from '../../../components/atoms/TextField';
import Button from '../../../components/atoms/Button';
import StatusBar from '../../../components/atoms/StatusBar';
import { COUNTRY, RACE, IDENTITYTYPE } from "../../../constants";
import { useStateData } from "../../../hooks/services/useStateData";
import { useCountyData } from "../../../hooks/services/useCountyData";
import { useCityData } from "../../../hooks/services/useCityData";
import { usePincodeData } from '../../../hooks/services/usePincode';
import { useLandmarkData } from '../../../hooks/services/useLandmark';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DatePicker from 'react-native-date-picker';
import { useSignUp } from "../../../hooks/services/useSignUp";
import { RadioButton } from 'react-native-paper';
import Toast from '../../../components/atoms/Snackbar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import getColors from '../../../utils/colors';

const SignUp = ({ navigation }) => {
  const styles = signupScreenStyles();
  const { data, isLoading, error, setPayload } = useSignUp();
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();
  const {pincodeData,setPicodePayload } = usePincodeData();
  const {landmarkData, setLandmarkPayload } = useLandmarkData();
  const [selCountry, setSelCountry] = useState();
  const [selState, setSelState] = useState([]);
  const [selCity, setSelCity] = useState([]);
  const [selCounty, setSelCounty] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState();
  const [checked, setChecked] = useState('male');
  const [idProof, setIdProof] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { themeColors } = getColors();
  const [cntry, setCntry] = useState('CO-42A82D09');
  const [stet, setStet] = useState('');
  const [cnty, setCnty] = useState('')
  const [cty, setCty] =  useState('');
  const [userDetails, setUserDetails] = useState({
    firstName: {
      label: 'First Name',
      value: '',
    },
    lastName: { label: 'Last Name', value: '' },
    phone: { label: 'Mobile', value: '', type: 'phone' },
    email: { label: 'Email', value: '' },
    password: { label: 'Password', value: '', type: 'password' },
    confirmPassword: { label: 'Confirm Password', value: '', type: 'password' },
    dob: { label: 'Date of Birth', value: '' },
    ethnicity: { label: 'Race/Ethnicity', value: '', type: 'dropdown' },
    gender: { label: 'Gender', value: checked },
    zelle_id  : { label: 'Zelle Id', value: '' },
    address1: { label: 'Address Line 1', value: '' },
    address2: { label: 'Address Line 2', value: '' },
    apartmentNo: { label: 'House No', value: 'N/A' },
    country: { label: 'Country', value: '', type: 'dropdown' },
    state: { label: 'State', value: '', type: 'dropdown' },
    county: { label: 'County', value: '', type: 'dropdown' },
    city: { label: 'City', value: '', type: 'dropdown' },
    zip: { label: 'Zip Code', value: ''  },
    landmark: { label: 'Landmark/Housing Community', value: '' },
    ssn: { label: 'SSN Number (optional)', value: '' },
    id_type: { label: 'Identity Type', value: '' },
    id_number: { label: 'Identity Number', value: '' },
    id_proof_file_name: { label: 'Image upload', value: '' },
  });

  const dropDownList = ['country', 'state', 'city', 'county', 'gender', 'ethnicity', 'id_type', 'id_proof_file_name'];
  const optionalFields = ['ssn', 'address2', 'apartmentNo'];
  const countryRef = useRef(null)

  const handleFormChange = (fieldName, value) => {
    setUserDetails(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        value,
      },
    }));
    if(fieldName == 'zip'){
      let valid = false;
      let numbers = '0123456789';
    
      for (var i=0; i < value.length; i++) {
          if(numbers.indexOf(value[i]) > -1 ) {
              valid=true;
          }
          else {
            valid = false;
            value = '';
            setUserDetails(prevState => ({
              ...prevState,
              [fieldName]: {
                ...prevState[fieldName],
                value,
              },
            }));
          }
      }
      if(valid == true){
        value = value.replace(/\s/g, "").slice(0,5);
        setUserDetails(prevState => ({
          ...prevState,
          [fieldName]: {
            ...prevState[fieldName],
            value,
          },
        }));
      }
    }
    if(fieldName == 'ssn'){
      let valid = false;
      let numbers = '0123456789';
    
      for (var i=0; i < value.length; i++) {
          if(numbers.indexOf(value[i]) > -1 ) {
              valid=true;
          }
          else {
            valid = false;
            value = '';
            setUserDetails(prevState => ({
              ...prevState,
              [fieldName]: {
                ...prevState[fieldName],
                value,
              },
            }));
          }
      }
      // if(valid == true){
      //   value = value.replace(/\s/g, "").slice(0,5);
      //   setUserDetails(prevState => ({
      //     ...prevState,
      //     [fieldName]: {
      //       ...prevState[fieldName],
      //       value,
      //     },
      //   }));
      // }
    }
  };

  // get state list
  useEffect(() => {
    setStateData('CO-42A82D09');
  }, [])

  // get county list
  useEffect(() => {
    if (userDetails?.state !== '') setCountyData(userDetails?.state?.value);
  }, [userDetails?.state])

  // get city list
  useEffect(() => {
    if (userDetails?.county !== '') setCityData(userDetails?.county?.value);
  }, [userDetails?.county])

  const handleChoosePhoto = async (id) => {
    const options = {
      title: 'Choose an Image',
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 300,
      maxHeight: 300,
      videoQuality: 'low',
      noData: true,
      fileSize: 1
   };
    const result = await launchImageLibrary(options);
    const base64 = `data:${result?.assets[0].type};base64`;
    setIdProof(base64);
    handleFormChange(id, result?.assets[0].base64);
  };

  const config = {
    backgroundColor: '#f2f2f2',
    selectedBackgroundColor: '#ccc',
    borderColor: '#D3DFEF',
    borderWidth: 1,
    width: '100%'
  }

  handleDropdownChange = (fieldName, val) => {
    if (!val) return;
    if (fieldName === 'country') setSelCountry(val);
    if (fieldName === 'state') setSelState(val);
    if (fieldName === 'county') setSelCounty(val);
    if (fieldName === 'city') setSelCity(val);
    const value = val?.id;

    setUserDetails(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        value,
      },
    }));

    if (fieldName === 'state'){
      // setStet(val?.id)
      alert("State Name : ",JSON.stringify(val));
      
    } 

  }

  const onSubmitHandler = () => {
    // const payload = { ... };
    // delete payload.address;
    // delete payload.confirmPassword;
    // delete payload.apartmentNo;
    // delete payload.location;
    setIsSignUp(true);
    setPayload({
      firstName: userDetails?.firstName?.value,
      lastName: userDetails?.lastName?.value,
      email: userDetails?.email?.value,
      password: userDetails?.password?.value,
      dob: moment(date).format('YYYY-MM-DD'),
      gender: userDetails?.gender?.value,
      ethnicity: userDetails?.ethnicity?.value,
      country: userDetails?.country?.value,
      state: userDetails?.state?.value,
      county: userDetails?.county?.value,
      city: userDetails?.city?.value,
      pincode: userDetails?.zip?.value,
      zelle_id: userDetails?.address1?.value,
      address1: userDetails?.address1?.value,
      address2: userDetails?.address2?.value,
      apartment_number: userDetails?.apartmentNo?.value,
      profile_pic: '',
      mobile: userDetails?.phone?.value?.code + userDetails?.phone?.value?.value,
      id_type: userDetails?.id_type?.value,
      id_number: userDetails.id_number?.value.replace(/-/g, ''),
      pincode: userDetails?.zip?.value.replace(/-/g, ''),
      id_proof_file_name: `${idProof},${userDetails.id_proof_file_name?.value}`
    });
  }

  useEffect(() => {
    if (data && !error) {
      // navigation.navigate('SignIn');
      navigation.navigate('Instruction')
    }
    // setIsSignUp(false);
  }, [data, error]);

  const onFocusHandler = (item) => {
    if (item === 'dob') {
      setOpen(true)
    }
  }

  const onBlurHandler = (item) => {
    if (item === 'dob') {
      setOpen(false);
      handleFormChange(item, moment(date).format('DD-MM-YYYY'))
    }
    Keyboard.dismiss();
  }

 

  return (
    <View style={{ flex: 1 }}>
      <StatusBar color={'white'} />
      <ScrollView
        style={styles.pageContainer}

        // keyboardShouldPersistTaps='always'
        contentContainerStyle={{
          alignItems: 'center',
        }}
        >
        <View>
          <Grid gap={40} dir="column">
            <View>
              <Text style={styles.header}>Create your Money-Mails account</Text>
              {/* <Avatar
                src={require('../../../assets/images/brand.png')}
                flatStyle
                rounded
                size={150}
              /> */}
              <Image
                source={require('../../../assets/images/brand.png')}
              />
            </View>
            <Grid
              gap={10}
              dir="column"
              containerStyles={styles.readOnlyFormContainer}>
              {Object.keys(userDetails).map((item, idx) => {
                let icn;
                if (item === 'location') {
                  icn = 'map-marker';
                } else if (item === 'dob') {
                  icn = 'calendar';
                }
                return (
                  <View style={styles.detailsItem} key={item}>
                    {item === 'ethnicity' && <>
                      <AutocompleteDropdown
                        ref={countryRef}
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={val => handleDropdownChange('ethnicity', val)}
                        dataSet={RACE}
                        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        inputContainerStyle={{
                          marginTop: 25,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                    </>}
                    {item === 'country' && <>
                      <AutocompleteDropdown
                        ref={countryRef}
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={val => handleDropdownChange('country', val)}
                        dataSet={COUNTRY}
                        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        inputContainerStyle={{
                          marginTop: 25,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                    </>}
                    {item === 'state' &&
                        <AutocompleteDropdown
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={val => handleDropdownChange('state', val)}
                        dataSet={stateData}
                        containerStyle={{ flexGrow: 1, flexShrink: 1,flex:1}}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        
              
                        inputContainerStyle={{
                          marginTop: 5,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                     
                    }
                    {item === 'county' &&
                      <AutocompleteDropdown
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={val => handleDropdownChange('county', val)}
                        dataSet={countyData}
                        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        inputContainerStyle={{
                          marginTop: 5,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                    }
                    {item === 'city' &&
                      <AutocompleteDropdown
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        initialValue={{ id: '1' }}
                        onSelectItem={val => handleDropdownChange('city', val)}
                        dataSet={cityData}
                        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        inputContainerStyle={{
                          marginTop: 5,
                          marginBottom: -7,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                    }
                    {item === 'id_type' && <>
                      <AutocompleteDropdown
                        ref={countryRef}
                        direction={'up'}
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onSelectItem={val => handleDropdownChange('id_type', val)}
                        dataSet={IDENTITYTYPE}
                        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                        textInputProps={{
                          placeholder: `${userDetails[item].label}*`
                        }}
                        inputContainerStyle={{
                          marginTop: 25,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: 1,
                          borderRadius: 5,
                        }}
                      />
                    </>}
                    {item === 'gender' && <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <RadioButton
                        value="male"
                        status={checked === 'male' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('male')}
                        />
                        <Text>Male</Text>
                      </View>
                      <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <RadioButton
                        value="feMale"
                        status={checked === 'feMale' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('feMale')}
                        />
                        <Text>Female</Text>
                      </View>
                    </View>}
                    {(dropDownList.indexOf(item) === -1 && item !='dob') && <TextField
                      style={{
                        width: 300,
                      }}
                      isOutLined
                      value={item === 'phone' ? userDetails[item].value?.value : userDetails[item].value}
                      label={`${userDetails[item].label} ${optionalFields.includes(item) ? '' : '*'}`}
                      onChange={value => {handleFormChange(item, value)}}
                      onFocus={() => item === 'dob' ? onFocusHandler(item) : ''}
                      onBlur={() => item === 'dob' ? onBlurHandler(item) : ''}
                      returnKeyType={
                        idx === Object.keys(userDetails).length - 1
                          ? 'go'
                          : 'next'
                      }
                      type={userDetails[item].type || 'text'}
                      {...(userDetails[item].textFieldProps || {})}
                    />}
                    {(dropDownList.indexOf(item) === -1 && item ==='dob') &&
                      <View style={styles.detailsItemCalender} key={14}>
                      <TextField
                        style={{
                          width: 300,
                        }}
                        isOutLined
                        value={item === 'phone' ? userDetails[item].value?.value : userDetails[item].value}
                        label={`${userDetails[item].label} ${optionalFields.includes(item) ? '' : '*'}`}
                        onChange={value => {handleFormChange(item, value)}}
                        onFocus={() => item === 'dob' ? onFocusHandler(item) : ''}
                        onBlur={() => item === 'dob' ? onBlurHandler(item) : ''}
                        returnKeyType={
                          idx === Object.keys(userDetails).length - 1
                            ? 'go'
                            : 'next'
                        }
                        type={userDetails[item].type || 'text'}
                        {...(userDetails[item].textFieldProps || {})}
                        
                      />
                        <FontAwesomeIcon
                          name={'calendar'}
                          size={20}
                          color={themeColors.fontPrimary}
                          style={{
                            marginRight: 15,
                            alignSelf: 'flex-end',
                            marginTop : -20
                          }}
                        />
                      </View>
                    }
                  </View>
                );
              })}
              <>
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={date}
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    handleFormChange('dob', moment(date).format('DD-MM-YYYY'))
                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
                />
              </>
              <View
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: '#D3DFEF',
                  borderRadius: 5,
                }}>
                <Button
                  variant="secondary"
                  size="medium"
                  btnText="Choose Photo"
                  onPress={() => handleChoosePhoto('id_proof_file_name')}
                />
              </View>
              {idProof !== '' && <Image style={{width: 100, height: 50, resizeMode: 'cover'}} source={{uri: `${idProof},${userDetails['id_proof_file_name']?.value}`}} />}
            </Grid>
          </Grid>
          <Button
            btnText="Create Account"
            size="large"
            onPress={onSubmitHandler}
            overridingStyles={styles.signUpBtn}
            btnTextOverrideStyles={styles.signUpBtnText}
          />
        </View>
      {isSignUp && <Toast style={{zIndex: 999}} message={error ? error : 'Your registration was success'} isOpen={true} />}
      </ScrollView>
    </View>
  );
};

export default SignUp;
