import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Grid from '../../../components/atoms/Grid';
import Button from '../../../components/atoms/Button';
import TextField from '../../../components/atoms/TextField';
import SignInIllustration from '../../../assets/images/signInIllustration.js';
import { DeviceContext } from '../../../context/DeviceContext';
import { styles as signUpScreenStyles } from './index.style';
import { useLogin } from "../../../hooks/services/useLogin";
import { UserContext } from "../../../context/UserContext";
// import Toast from '../../../components/atoms/Snackbar';
import { saveFCMToken } from '../../../utils/notificationService';
import { TextInput } from 'react-native-paper';

const SignIn = ({ navigation }) => {


  const { userDetails, setUserDetails } = useContext(UserContext);
  const { isIos, isAndroid, screenHeight } = useContext(DeviceContext);
  const { data, isLoading, error, message, setPayload } = useLogin();
  const [mobile, setMobile] = useState({});
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [isSecureText, setIsSecureText] = useState(true)

  const styles = signUpScreenStyles({ screenHeight, isIos });

  const onLoginHandler = (e) => {
    const normalizedCode = `${mobile?.code || "1"}`.startsWith("+")
      ? `${mobile?.code || "1"}`
      : `+${mobile?.code || "1"}`;
    const normalizedPhone = `${mobile?.value || ""}`.replace(/\D/g, "");

    setPayload({
      username: `${normalizedCode}${normalizedPhone}`,
      password,
    });
    setIsLogging(true);
  };

  const onLoad = async (data) => {
    if (!data) return;
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar || data?.profile_pic,
      mobile: data.mobile,
      ssn: data?.ssn,
      id_proof: data?.id_proof,
      id_number: data?.id_number,
      gender: data?.gender,
      age: data?.age,
      phone: {
        code: data?.mobile?.length === 11 ? data?.mobile.substr(0, 1) : data?.mobile.substr(0, 2),
        value: data?.mobile?.length === 11 ? data?.mobile.substr(1) : data?.mobile.substr(2),
      },
      primaryEmail: data.email,
      address: {
        location: data.address1,
        city: data.city,
        addressLine1: data.address2,
        state: data.state,
        county: data.county,
        country: data.country,
        apartmentNo: data.apartment_number,
        zip: data.pincode,
        landmark: data.landmark,
      },
      cities: data.cities,
      demographics: {
        race: data.ethnicity,
        dob: data.dob,
      },
      user_uuid: data?.uuid,
      uuid: data?.uuid,
      isAuthenticated: true,
      token: data.token,
      rewards: data?.rewards,
      bingo: data?.bingo
    }
    setUserDetails({ user_uuid: data?.uuid })
    setMobile({});
    setPassword("");
    setTimeout(() => {
      if (data?.user_verified_by_admin && data?.is_admin_sent_mail) {

        if (data?.user_verified) {
          setUserDetails(userData);
          onSaveData(userData);
          navigation.navigate('UserScreens')
        } else {
          navigation.navigate("Verification")
        }
      } else {
        navigation.navigate('PendingVerification')
      }

    }, 1000)
  }

  const onSaveData = async (userData) => {
    if (!userData) return;
    userData.bingoDetail = JSON.stringify(data.bingoDetail)
    await AsyncStorage.setItem("auth", JSON.stringify(true));
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", JSON.stringify(data.token));
    await AsyncStorage.setItem("bingo", JSON.stringify(data.bingo));
    saveFCMToken(userData.uuid);
  }

  useEffect(() => {
    if (data) {
      onLoad(data);
    }
  }, [data]);

  useEffect(() => {
    setTimeout(function () { if (isLogging) setIsLogging(false) }, 3000);
  }, [isLogging])

  return (
    <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.pageContainer}>
          <SignInIllustration height="25%" />
          <View style={styles.formContainer}>
            <Text style={styles.pageTitle}>Login to your Account</Text>
            <Grid
              dir="column"
              gap={screenHeight * 0.05}
              containerStyles={styles.fieldsWrapper}>
              <TextField
                value={mobile?.value || ""}
                label="Phone Number"
                onChange={(val) => setMobile(val)}
                returnKeyType="next"
                type="phone"
              />
              <View>
                <TextField
                  value={password}
                  label="Password"
                  onChange={(val) => setPassword(val)}
                  returnKeyType="go"
                  type={isSecureText ? "password" : "text"}
                  right={(isSecureText) ? <TextInput.Icon icon="eye" onPress={() => setIsSecureText(!isSecureText)} /> : <TextInput.Icon icon="eye-off" onPress={() => setIsSecureText(!isSecureText)} />}
                />

                <Button
                  btnText="Forgot Password?"
                  variant="secondary"
                  type="text"
                  style={{
                    marginLeft: 'auto',
                    marginTop: isAndroid ? 32 : 16,
                  }}
                  btnTextOverrideStyles={{
                    color: '#898989',
                    fontSize: 13,
                  }}
                  onPress={() => navigation.navigate('ResetPassword')}
                />
                <Button
                  btnText="Login"
                  variant="primary"
                  fontStrong
                  size="large"
                  overridingStyles={styles.loginBtn}
                  onPress={onLoginHandler}
                />
                <View style={{ marginTop: 15 }}>
                  <Button
                    btnText="Sign up"
                    variant="secondary"
                    type="link"
                    linkpreText="Don't have an account?"
                    onPress={() => navigation.navigate('SignUpInfo')}
                  />
                </View>
              </View>
            </Grid>
          </View>

          {/* {(isLogging && message) && <Toast message={message} isOpen={true} />} */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
