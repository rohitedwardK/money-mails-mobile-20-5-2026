import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Image, SafeAreaView, TouchableOpacity, Dimensions, Platform, StyleSheet, FlatList, SectionList, KeyboardAvoidingView, Pressable, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { signupScreenStyles } from './index.style';
import StatusBar from '../../../components/atoms/StatusBar';
import { TextInput, RadioButton, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import PhoneInput from "react-native-phone-number-input";
import DatePicker from 'react-native-date-picker';
import Button from '../../../components/atoms/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { COUNTRYS, RACES, IDENTITYTYPES } from "../../../constants";
import { useStateData } from "../../../hooks/services/useStateData";
import { useCountyData } from "../../../hooks/services/useCountyData";
import { useCityData } from '../../../hooks/services/useCityData';
import Toast from '../../../components/atoms/Snackbar';
import { useSignUp } from "../../../hooks/services/useSignUp";
import { textFieldStyles } from "../../../components/atoms/TextField/index.style";
import Snackbar from 'react-native-snackbar';
import axios from "axios";
import { Tooltip } from "react-native-elements";
import { usePincodeData } from "../../../hooks/services/usePincode";
import { useLandmarkData } from "../../../hooks/services/useLandmark";
import { SelectList } from "react-native-dropdown-select-list"
import { baseUrl } from "../../../connections";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue', // You can adjust the primary color as needed
    accent: 'blue',
  },
};

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const SignUp = ({ navigation }) => {

  const styles = signupScreenStyles();
  const [countryCode, setCountryCode] = useState('1');
  const [idProof, setIdProof] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusRace, setIsFocusRce] = useState(false);
  const [isFocusCountry, setIsFocusCountry] = useState(false);
  const [isFocusState, setIsFocusState] = useState(false);
  const [isFocusCounty, setIsFocusCounty] = useState(false);
  const [isFocusCity, setIsFocusCity] = useState(false);
  const [isFocusZip, setIsFocusZip] = useState(false);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const phoneInput = useRef(null);
  const [gender, setGender] = React.useState('male');
  const { stateData, setStateData } = useStateData();
  const { countyData, setCountyData } = useCountyData();
  const { cityData, setCityData } = useCityData();
  const { data, isLoading, error, setPayload } = useSignUp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [passwordSecureConfirm, setPasswordSecureConfirm] = useState(true)

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [county, setCounty] = useState("");
  const [countyNew, setCountyNew] = useState("")
  const [city, setCity] = useState("");
  const [cityNew, setCityNew] = useState("")


  const { pincodeData, setPicodePayload } = usePincodeData();
  const { landmarkData, setLandmarkPayload } = useLandmarkData();


  const handleOnChangeText = (text) => {
    // Use regex to only allow digits
    const formattedText = text.replace(/[^\d]/g, '');

    // Limit the input to 10 digits
    if (formattedText.length <= 10) {
      setPhoneNumber(formattedText);
    }
  };

  const handleOnEndEditing = () => {
    const isValid = phoneInput.isValidNumber();
    setIsValidNumber(isValid);
  };

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
    gender: { label: 'Gender', value: gender },
    zelle_id: { label: 'Zelle Id', value: '' },
    address1: { label: 'Address Line 1', value: '' },
    address2: { label: 'Address Line 2', value: '' },
    apartmentNo: { label: 'House No', value: 'N/A' },
    country: { label: 'Country', value: '', type: 'dropdown' },
    state: { label: 'State', value: '', type: 'dropdown' },
    county: { label: 'County', value: '', type: 'dropdown' },
    city: { label: 'City', value: '', type: 'dropdown' },
    zip: { label: 'ZIP Code', value: '' },
    landmark: { label: 'Landmark/Housing Community', value: '' },
    ssn: { label: 'SSN Number (optional)', value: '' },
    id_type: { label: 'Identity Type', value: '' },
    id_number: { label: 'Identity Number', value: '' },
    id_proof_file_name: { label: 'Image upload', value: '' },
    profile_pic: { label: 'Profile Pic', value: '' }
  });

  const handleFormChange = (fieldName, value) => {
    setUserDetails(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        value,
      },
    }));
    if (fieldName == 'zip') {
      let valid = false;
      let numbers = '0123456789';

      for (var i = 0; i < value.length; i++) {
        if (numbers.indexOf(value[i]) > -1) {
          valid = true;
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
      if (valid == true) {
        value = value.replace(/\s/g, "").slice(0, 5);
        setUserDetails(prevState => ({
          ...prevState,
          [fieldName]: {
            ...prevState[fieldName],
            value,
          },
        }));
      }
    }
    if (fieldName == 'phone') {
      let valid = false;
      let numbers = '0123456789';
      for (var i = 0; i < value.length; i++) {
        if (numbers.indexOf(value[i]) > -1) {
          valid = false;
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

    }
    if (fieldName == 'ssn') {
      let valid = false;
      let numbers = '0123456789';

      for (var i = 0; i < value.length; i++) {
        if (numbers.indexOf(value[i]) > -1) {
          valid = true;
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
    }
  };

  const uploadImage = async (imageUri, type, name, field) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: type, // adjust the file type based on your requirement
        name: name,
      });

      const response = await axios.post(`${baseUrl}/user/upload/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === true) {
        if (field === 'profile') {
          setProfilePic(response.data.image.filename)
        }
        if (field === 'idProof') {
          setIdProof(response.data.image.filename)
        }
      }
    } catch (error) {
      console.error('Upload failed:', error?.response?.data);
    }
  };
  const handleChoosePhoto = async (id) => {
    const options = {
      title: 'Choose an Image',
      mediaType: 'photo',
      // includeBase64: true,
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.9,
      videoQuality: 'low',
      noData: true,
      fileSize: 1
    };
    if (id === 'id_proof_file_name') {
      const result = await launchImageLibrary(options);
      uploadImage(result?.assets[0].uri, result?.assets[0].type, result?.assets[0].fileName, 'idProof')
      const base64 = `data:${result?.assets[0].type};base64`;
      // setIdProof(base64);
      handleFormChange(id, result?.assets[0].base64);
    } else {
      const result = await launchImageLibrary(options);
      uploadImage(result?.assets[0].uri, result?.assets[0].type, result?.assets[0].fileName, 'profile')
      const base64 = `data:${result?.assets[0].type};base64`;
      // setProfilePic(base64);
      handleFormChange(id, result?.assets[0].base64);
    }

  };

  const onSubmitHandler = () => {

    if (userDetails?.zip?.value && userDetails?.zip?.value.length != 5) {
      setIsSignUp(false);
      Snackbar.show({
        text: 'Enter Valid Zip',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (userDetails?.phone?.value.length != 11) {
      setIsSignUp(false);
      Snackbar.show({
        text: 'Enter Valid Mobile Number.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (userDetails?.confirmPassword?.value === "") {
      setIsSignUp(false);
      Snackbar.show({
        text: 'Confirm Password is required.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (userDetails?.password?.value !== userDetails?.confirmPassword?.value) {
      setIsSignUp(false);
      Snackbar.show({
        text: 'Password and Confirm Password should be same.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
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
        // pincode: userDetails?.zip?.value,
        // landmark: userDetails?.landmark.value,
        pincode: zipInput,
        landmark: landmarkInput,
        // zelle_id: userDetails?.zelle_id?.value,
        address1: userDetails?.address1?.value,
        address2: userDetails?.address2?.value,
        apartment_number: userDetails?.apartmentNo?.value,
        // profile_pic: `${profilePic},${userDetails.profile_pic?.value}`,
        profile_pic: `${profilePic}`,
        mobile: userDetails?.phone?.value,
        // id_type: userDetails?.id_type?.value,
        // id_number: userDetails.id_number?.value.replace(/-/g, ''),
        // pincode: userDetails?.zip?.value.replace(/-/g, ''),
        // id_proof_file_name: `${idProof}`
      });
    }

  }

  useEffect(() => {
    if (data && !error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignUp' }]
      })
      navigation.navigate('Instruction')
    }
  }, [data, error]);


  // const [zipInput, setZipInput] = useState(userDetails["zip"].value || "");
  // const [filteredData, setFilteredData] = useState([]);
  // const [showDropdown, setShowDropdown] = useState(false);

  // const handleZipChange = (zip) => {
  //   // Use your validation logic with handleFormChange
  //   handleFormChange("zip", zip);
  //   setZipInput(zip);

  //   if (zip.trim() === "") {
  //     setShowDropdown(false);
  //     return;
  //   }

  //   // Filter ZIP codes based on input
  //   const matches = pincodeData.filter((item) =>
  //     item.value.toLowerCase().startsWith(zip.toLowerCase())
  //   );

  //   if (matches.length === 0) {
  //     setFilteredData([{ label: `Save "${zip}"`, value: zip }]);
  //   } else {
  //     setFilteredData(matches);
  //   }

  //   setShowDropdown(true);
  // };

  // const handleSelectZip = (zip) => {
  //   handleFormChange("zip", zip);  // Validate and save the selected ZIP
  //   setZipInput(zip);
  //   setShowDropdown(false);
  // };

  const [zipInput, setZipInput] = useState(userDetails["zip"].value || "");
  const [landmarkInput, setLandmarkInput] = useState(userDetails["landmark"].value || "");
  const [filteredZipData, setFilteredZipData] = useState([]);
  const [filteredLandmarkData, setFilteredLandmarkData] = useState([]);
  const [showZipDropdown, setShowZipDropdown] = useState(false);
  const [showLandmarkDropdown, setShowLandmarkDropdown] = useState(false);

  // ✅ Handle ZIP Changes
  const handleZipChange = (zip) => {
    // handleFormChange("zip", zip);
    setZipInput(zip);
    setLandmarkPayload(`country_uuid=${userDetails?.country?.value}&state_uuid=${userDetails?.state?.value}&county_uuid=${userDetails?.county?.value}&city_uuid=${userDetails?.city?.value}&pincode=${zip}`)


    if (zip.trim() === "") {
      setShowZipDropdown(false);
      return;
    }

    const matches = pincodeData.filter((item) =>
      item.value.toLowerCase().startsWith(zip.toLowerCase())
    );

    // setFilteredZipData(matches.length ? matches : [{ label: `Save "${zip}"`, value: zip }]);
    setFilteredZipData(matches.length ? matches : []);

    setShowZipDropdown(true);
  };

  const handleSelectZip = (zip) => {
    // handleFormChange("zip", zip);
    setZipInput(zip);

    setLandmarkPayload(`country_uuid=${userDetails?.country?.value}&state_uuid=${userDetails?.state?.value}&county_uuid=${userDetails?.county?.value}&city_uuid=${userDetails?.city?.value}&pincode=${zip}`)
    setShowZipDropdown(false);
    Keyboard.dismiss();

  };

  // ✅ Handle Landmark Changes
  const handleLandmarkChange = (value) => {
    // handleFormChange("landmark", value);
    setLandmarkInput(value);

    if (value.trim() === "") {
      setShowLandmarkDropdown(false);
      return;
    }

    const matches = landmarkData.filter((item) =>
      item.value.toLowerCase().startsWith(value.toLowerCase())
    );

    // setFilteredLandmarkData(matches.length ? matches : [{ label: `Save "${value}"`, value: value }]);
    setFilteredLandmarkData(matches.length ? matches : []);
    setShowLandmarkDropdown(true);
  };

  const handleSelectLandmark = (landmark) => {
    // handleFormChange("landmark", landmark);
    setLandmarkInput(landmark);
    setShowLandmarkDropdown(false);
  };

  return (
    <PaperProvider theme={theme}>

      {/* <ScrollView> */}
      <View style={{ flex: 1, backgroundColor: 'white', marginTop: 0 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <DismissKeyboard>
            <ScrollView
              keyboardShouldPersistTaps="always"

              style={[styles.pageContainer, { flexGrow: 1 }]}
              contentContainerStyle={{
                alignItems: 'center',
                marginBottom: 50
              }}
            >
              <View>
                <Text style={styles.header}>Create your Money-Mails account</Text>

                <Image
                  source={require('../../../assets/images/brand.png')}
                  style={{ margin: 20 }}
                />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => handleChoosePhoto('profile_pic')}>
                    {profilePic === '' && <Image
                      source={require('../../../assets/images/profile.png')}
                      style={{ width: 100, height: 100, borderRadius: 15 }}
                    />}

                    {profilePic !== '' && <Image style={{ width: 100, height: 100, resizeMode: 'cover', marginTop: 10 }} source={{ uri: `${profilePic}` }} />}

                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    // position: 'absolute',
                    right: 2,
                    alignItems: 'flex-end',
                    top: -45, // Adjust as needed
                  }}
                >
                  <Tooltip
                    height={60}
                    width={300}
                    withOverlay={false}
                    popover={<Text>Upload Profile Picture: Helps us match your ID for verification purposes.</Text>}>
                    <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                  </Tooltip>
                </View>
                <View style={{ marginBottom: 10 }}>
                  {/* TextInput from react-native-paper */}
                  <TextInput
                    mode="outlined"
                    label="First Name *"
                    placeholder="Enter First Name"
                    value={userDetails['firstName'].value}
                    onChangeText={(value) => { handleFormChange('firstName', value); }}
                  />
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      position: 'absolute',
                      right: 2,
                      top: 10, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={80}
                      width={300}
                      withOverlay={false}
                      popover={<Text>First Name / Last Name: Used to personalize your account and communications.</Text>}>
                      <Text style={{ marginTop: 0 }}><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <TextInput
                    mode="outlined"
                    label="Last Name *"
                    placeholder="Enter Last Name"
                    value={userDetails['lastName'].value}
                    onChangeText={(value) => { handleFormChange('lastName', value); }}
                  />
                  <TextInput
                    mode="outlined"
                    label="Email ID *"
                    placeholder="Enter Email ID"
                    value={userDetails['email'].value}
                    onChangeText={(value) => { handleFormChange('email', value); }}
                  />
                  {/* MObile */}
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -45, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={60}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Primary Email: Your unique login ID and the primary way to receive deals and updates.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>

                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={userDetails?.phone?.value}
                    value={userDetails?.phone?.value}
                    codeTextStyle={{ color: '#333' }}
                    defaultCode="US"
                    layout="first"
                    onChangeText={(text) => {
                      // setValue(text.slice(0,10));
                      setValue(text)
                      handleFormChange('phone', '1' + text)
                    }}
                    onChangeFormattedText={(text) => {
                      setFormattedValue(text);
                    }}
                    countryPickerProps={{
                      countryCodes: ['US'],
                    }}
                    containerStyle={{
                      borderRadius: 5,
                      // marginTop: 10,
                    }}

                    placeholder="Enter Mobile Number"
                    textProps={{
                      maxLength: 10,
                      keyboardType: 'numeric',

                    }}
                    withDarkTheme
                    withShadow
                  // autoFocus

                  />
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -45, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={60}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Phone Number: Required for account recovery and updates. Must be unique.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  {/* End Mobile */}
                  <TextInput
                    mode="outlined"
                    label="Password *"
                    placeholder="Enter Password"
                    value={userDetails['password'].value}
                    onChangeText={(value) => { handleFormChange('password', value); }}
                    secureTextEntry={passwordSecure}
                    right={passwordSecure ? <TextInput.Icon icon="eye" onPress={() => setPasswordSecure(!passwordSecure)} /> : <TextInput.Icon icon="eye-off" onPress={() => setPasswordSecure(!passwordSecure)} />}
                  />
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={60}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Password/Confirm Password: Secures your account.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <TextInput
                    mode="outlined"
                    label="Confirm Password *"
                    placeholder="Enter Confirm Password"
                    value={userDetails['confirmPassword'].value}
                    onChangeText={(value) => { handleFormChange('confirmPassword', value); }}
                    secureTextEntry={passwordSecureConfirm}
                    right={passwordSecureConfirm ? <TextInput.Icon icon="eye" onPress={() => setPasswordSecureConfirm(!passwordSecureConfirm)} /> : <TextInput.Icon icon="eye-off" onPress={() => setPasswordSecureConfirm(!passwordSecureConfirm)} />}
                  />

                  {/* Date Of Birth */}
                  <TextInput
                    mode="outlined"
                    label="D.O.B"
                    value={userDetails['dob'].value}
                    placeholder="DD-MM-YYYY"
                    right={<TextInput.Icon icon="calendar-month" onPress={() => setOpen(true)} />}
                    onKeyPress={() => { setOpen(true) }}
                  />
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={60}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Date of Birth: Ensures age-appropriate deals and offers.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                      setOpen(false)
                      handleFormChange('dob', moment(date).format("YYYY-MM-DD"))
                      setDate(date)
                    }}
                    onCancel={() => {
                      handleFormChange('dob', '')
                      setOpen(false)
                    }}
                  />
                  {/* End Date Of Birth */}
                  {/* Ethincity */}
                  <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[styles.dropdown, isFocusRace && { borderColor: 'black' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: 'black' }}
                      iconStyle={styles.iconStyle}
                      data={RACES}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocusRace ? 'Race / Ethincity ' : '...'}
                      searchPlaceholder="Search..."
                      value={userDetails['ethnicity'].value}
                      onFocus={() => setIsFocusRce(true)}
                      onBlur={() => setIsFocusRce(false)}
                      onChange={item => {
                        // setValue(item.value);
                        handleFormChange('ethnicity', item.value)
                        setIsFocusRce(false);
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocus ? 'black' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                    {/* Icon in the top-right corner */}
                    <View
                      style={{
                        // position: 'absolute',
                        right: 2,
                        alignItems: 'flex-end',
                        top: -50, // Adjust as needed
                      }}
                    >
                      <Tooltip
                        height={60}
                        width={300}
                        withOverlay={false}
                        popover={<Text>Race/Ethnicity: Helps us tailor deals specific to your cultural background.</Text>}>
                        <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                      </Tooltip>
                    </View>
                  </View>
                  {/* End Ethincity */}
                  {/* Gender */}

                  {Platform.OS === 'ios' && <RadioButton.Group onValueChange={newValue => handleFormChange('gender', newValue)} value={userDetails['gender'].value}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{
                          width: 20,
                          height: 20,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <View style={{
                            backgroundColor: (userDetails['gender'].value == 'male') ? '#4C987E' : 'white',
                            padding: 2,
                            height: 15,
                            width: 15,
                            borderRadius: 50,
                          }}>
                            <RadioButton value="male" />
                          </View>

                        </View>
                        <Text style={{ marginLeft: 20, fontSize: 16 }}>Male</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{
                          width: 20,
                          height: 20,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <View style={{
                            backgroundColor: (userDetails['gender'].value == 'female') ? '#4C987E' : 'white',
                            padding: 2,
                            height: 15,
                            width: 15,
                            borderRadius: 50,
                          }}>
                            <RadioButton value="female" />
                          </View>

                        </View>
                        <Text style={{ marginLeft: 20, fontSize: 16 }}>Female</Text>
                      </View>
                      <View
                        style={{
                          right: 2,
                          alignItems: 'flex-end',
                        }}
                      >
                        <Tooltip
                          height={60}
                          width={300}
                          withOverlay={false}
                          popover={<Text>Gender: Provides gender-specific deals and promotions.</Text>}>
                          <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                        </Tooltip>
                      </View>
                    </View>
                  </RadioButton.Group>}
                  {Platform.OS === 'android' && <RadioButton.Group onValueChange={newValue => handleFormChange('gender', newValue)} value={userDetails['gender'].value}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton value="male" />
                        <Text style={{ marginTop: 8, marginLeft: 20, fontSize: 16 }}>Male</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton value="female" />
                        <Text style={{ marginTop: 8, marginLeft: 20, fontSize: 16 }}>Female</Text>
                      </View>
                      <View
                        style={{
                          right: 2,
                          alignItems: 'flex-end',
                        }}
                      >
                        <Tooltip
                          height={60}
                          width={300}
                          withOverlay={false}
                          popover={<Text>Gender: Provides gender-specific deals and promotions.</Text>}>
                          <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                        </Tooltip>
                      </View>
                    </View>
                  </RadioButton.Group>}

                  {/* End Gender */}
                  {/* <TextInput
                    mode="outlined"
                    label="Zelle ID "
                    placeholder="Zelle ID"
                    value={userDetails['zelle_id'].value}
                    onChangeText={(value) => { handleFormChange('zelle_id', value); }}
                  />
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={60}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Zelle ID: Required to transfer rewards to you securely.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View> */}
                  <TextInput
                    mode="outlined"
                    label="Address 1 "
                    placeholder="Address Line 1"
                    value={userDetails['address1'].value}
                    onChangeText={(value) => { handleFormChange('address1', value); }}
                  />
                  {/* Icon in the top-right corner */}
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={80}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Address 1, Address 2, House No: Used to verify your account by sending a postal verification code.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <TextInput
                    mode="outlined"
                    label="Address 2 "
                    placeholder="Address Line 2"
                    value={userDetails['address2'].value}
                    onChangeText={(value) => { handleFormChange('address2', value); }}
                  />
                  <TextInput
                    mode="outlined"
                    label="House No "
                    placeholder="House No"
                    value={userDetails['apartmentNo'].value}
                    onChangeText={(value) => { handleFormChange('apartmentNo', value); }}
                  />
                  {/* Country */}
                  <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[styles.dropdown, isFocusCountry && { borderColor: 'black' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: 'black' }}
                      iconStyle={styles.iconStyle}
                      data={COUNTRYS}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocusCountry ? 'Select Country ' : '...'}
                      searchPlaceholder="Search..."
                      value={userDetails['country'].value}
                      onFocus={() => setIsFocusCountry(true)}
                      onBlur={() => setIsFocusCountry(false)}
                      onChange={item => {
                        handleFormChange('country', item.value);
                        setStateData(item.value)
                        // setValue(item.value);
                        setIsFocusCountry(false);
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocusCountry ? 'black' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                    {/* Icon in the top-right corner */}
                    <View
                      style={{
                        // position: 'absolute',
                        right: 2,
                        alignItems: 'flex-end',
                        top: -50, // Adjust as needed
                      }}
                    >
                      <Tooltip
                        height={100}
                        width={300}
                        withOverlay={false}
                        popover={<Text>Country, State, County, City, ZIP Code, Landmark/Housing Community:
                          Necessary for delivering localized deals and verifying your identity.</Text>}>
                        <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                      </Tooltip>
                    </View>
                  </View>
                  {/* End Country */}
                  {/* State */}
                  <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[styles.dropdown, isFocusState && { borderColor: 'black' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: 'black' }}
                      iconStyle={styles.iconStyle}
                      data={stateData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocusState ? 'Select State ' : '...'}
                      searchPlaceholder="Search..."
                      value={userDetails['state'].value}
                      onFocus={() => setIsFocusState(true)}
                      onBlur={() => setIsFocusState(false)}
                      onChange={item => {
                        handleFormChange('state', item.value);
                        setCountyData(item.value);
                        setValue(item.value);
                        setIsFocusState(false);
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocusState ? 'black' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                  </View>
                  {/* End State */}
                  {/* County */}
                  <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[styles.dropdown, isFocusCounty && { borderColor: 'black' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: 'black' }}
                      iconStyle={styles.iconStyle}
                      data={countyData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocusCounty ? 'Select County ' : '...'}
                      searchPlaceholder="Search..."
                      value={userDetails['county'].value}
                      onFocus={() => setIsFocusCounty(true)}
                      onBlur={() => setIsFocusCounty(false)}
                      onChange={item => {
                        handleFormChange('county', item.value)
                        setCityData(item.value)
                        setValue(item.value);
                        setIsFocusCounty(false);
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocus ? 'black' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                  </View>
                  {/* End County */}
                  {/* City */}
                  <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                      style={[styles.dropdown, isFocusCity && { borderColor: 'black' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: 'black' }}
                      iconStyle={styles.iconStyle}
                      data={cityData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocusCity ? 'Select City ' : '...'}
                      searchPlaceholder="Search..."
                      value={userDetails['city'].value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocusCity(false)}
                      onChange={item => {
                        setValue(item.value);
                        const pinpay = `country_uuid=${userDetails?.country?.value}&state_uuid=${userDetails?.state?.value}&county_uuid=${userDetails?.county?.value}&city_uuid=${item?.value}`
                        setPicodePayload(`country_uuid=${userDetails?.country?.value}&state_uuid=${userDetails?.state?.value}&county_uuid=${userDetails?.county?.value}&city_uuid=${item?.value}`)
                        handleFormChange('city', item.value)
                        setIsFocusCity(false);
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={isFocus ? 'black' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                  </View>
                  {/* End City */}
                  <View style={styles.container}>
                    {/* ZIP Field */}
                    <TextInput
                      mode="outlined"
                      style={styles.input}
                      placeholder="Enter or select ZIP"
                      value={zipInput}
                      maxLength={5}
                      onChangeText={handleZipChange}
                      onFocus={() => setShowZipDropdown(true)}
                      onBlur={() => setTimeout(() => setShowZipDropdown(false), 200)}
                      keyboardType="numeric"
                    />

                    {showZipDropdown && filteredZipData?.length > 0 && (
                      <ScrollView style={stylesData.dropdown} keyboardShouldPersistTaps="always">
                        {filteredZipData.map((item) => (
                          <TouchableOpacity
                            key={item.value}
                            style={stylesData.dropdownItem}
                            activeOpacity={0.7}
                            onPress={() => handleSelectZip(item.value)}
                          >
                            <Text style={stylesData.dropdownItemText} >{item.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}


                  </View>
                  <View style={styles.container}>
                    {/* Landmark / Housing Community Field */}
                    <TextInput
                      mode="outlined"
                      style={{
                        ...styles.input,
                        width: Dimensions.get('window').width - 70,
                        marginTop: 10
                      }}
                      placeholder="Landmark / Housing Community"
                      value={landmarkInput}
                      onChangeText={handleLandmarkChange}
                      onFocus={() => setShowLandmarkDropdown(true)}
                      onBlur={() => setTimeout(() => setShowLandmarkDropdown(false), 200)}
                    />

                    {showLandmarkDropdown && filteredLandmarkData?.length > 0 && (
                      <ScrollView style={stylesData.dropdown} keyboardShouldPersistTaps="always" >
                        {filteredLandmarkData.map((item) => (
                          <TouchableOpacity
                            key={item.value}
                            style={stylesData.dropdownItem}
                            onPress={() => handleSelectLandmark(item.value)}
                          >
                            <Text style={stylesData.dropdownItemText}>{item.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                  {/* <TextInput
                    mode="outlined"
                    label="SSN "
                    placeholder="SSN Number Optional"
                    style={{
                      ...styles.input,
                      width: Dimensions.get('window').width - 70
                    }}
                    value={userDetails['ssn'].value}
                    onChangeText={(value) => { handleFormChange('ssn', value); }}
                  />
                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      marginRight: -300,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={80}
                      width={300}
                      withOverlay={false}
                      popover={<Text>SSN Number (Optional): Helps ensure each user is unique but is not mandatory.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={{ color: 'black' }}
                    iconStyle={styles.iconStyle}
                    data={IDENTITYTYPES}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Identity Type ' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      handleFormChange('id_type', item.value)
                      setValue(item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'black' : 'black'}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />

                  <View
                    style={{
                      // position: 'absolute',
                      right: 2,
                      alignItems: 'flex-end',
                      top: -50, // Adjust as needed
                    }}
                  >
                    <Tooltip
                      height={80}
                      width={300}
                      withOverlay={false}
                      popover={<Text>Identity Type and Upload ID Proof: Verifies your identity to ensure you’re a
                        real and unique user.</Text>}>
                      <Text><AntDesign name="infocirlce" size={15} color={'black'} /></Text>
                    </Tooltip>
                  </View>
                  <TextInput
                    mode="outlined"
                    label="Identity Number "
                    placeholder="Identity Number"
                    style={{
                      width: Dimensions.get('window').width - 70,
                    }}
                    value={userDetails['id_number'].value}
                    onChangeText={(value) => { handleFormChange('id_number', value); }}
                  />


                  <View
                    style={{
                      width: Dimensions.get('window').width - 70,
                      paddingTop: 5,
                      paddingBottom: 5,
                      marginTop: 10,
                      borderWidth: 1,
                      borderColor: '#D3DFEF',
                      borderRadius: 5,
                    }}>
                    <Button
                      variant="secondary"
                      size="medium"
                      btnText="Image Upload "
                      onPress={() => handleChoosePhoto('id_proof_file_name')}
                    />
                  </View>
                  {idProof !== '' && <Image style={{ width: 100, height: 50, resizeMode: 'cover', marginTop: 10 }} source={{ uri: `${idProof}` }} />}
                   */}
                  <Button
                    btnText="Create Account"
                    size="large"
                    variant="primary"
                    onPress={onSubmitHandler}
                    overridingStyles={{ ...styles.signUpBtn, marginTop: 50 }}
                    btnTextOverrideStyles={styles.signUpBtnText}
                  />
                </View>

              </View>
              {/* {isSignUp && <Toast style={{zIndex: 999}} message={error ? error : 'Your registration was success'} isOpen={true} />} */}
            </ScrollView>
          </DismissKeyboard>
        </KeyboardAvoidingView>
      </View>
      {/* </ScrollView> */}
    </PaperProvider>
  )
}

const stylesData = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",  // Dim background
  },
  dropdownContainer: {
    width: "90%",
    maxHeight: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,  // Ensure it's above everything on Android
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    color: 'gray'
  }
  // container: {
  //   position: "relative",
  //   width: "100%"
  // },
  // input: {
  //   height: 40,
  //   borderWidth: 1,
  //   borderColor: "gray",
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   zIndex: 1,  // Ensure input doesn't overlap dropdown
  // },
  // dropdown: {
  //   flex: 1,
  //   position: "absolute",
  //   top: 45,
  //   left: 0,
  //   right: 0,
  //   zIndex: 9999,  // Ensure dropdown appears on top
  //   elevation: 5,   // Android compatibility
  //   backgroundColor: "red",
  //   borderWidth: 1,
  //   borderColor: "gray",
  //   borderRadius: 5,
  //   // maxHeight: 150,
  //   overflow: "visible",  // Ensure it doesn't get hidden
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  // },
  // dropdownItem: {
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#ddd",
  //   zIndex: 9999,
  // },
});
export default SignUp;