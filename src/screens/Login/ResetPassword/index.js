import React, {useContext, useState, useEffect} from 'react';
import {View, Text,
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Button from '../../../components/atoms/Button';
import TextField from '../../../components/atoms/TextField';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as resetPasswordStyles} from './index.style';
import { usePassword } from "../../../hooks/services/usePassword";
import { IDENTITYTYPE } from "../../../constants";
import { IdProofFormat } from "../../../utils";
import Toast from '../../../components/atoms/Snackbar';


const ResetPassword = ({navigation, route}) => {
  const { verifyData = {}, updateResult, passError, isRequest, setMobilePayload, setResetPayload, isPassLoading } = usePassword();
  const {isIos, screenHeight} = useContext(DeviceContext);
  const [identityLable, setIdentityLable] = useState();
  const [identityNumber, setIdentityNumber] = useState("");
  const [mobile, setMobile] = useState({});
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [formData, setFormData] = useState({
    phone: '',
  });
  const resetEmail = route?.params?.email || '';

  const styles = resetPasswordStyles({screenHeight, isIos});

  useEffect(()=>{
    if(verifyData?.data) {
      const lable = IDENTITYTYPE.find(item => item.id === verifyData?.data);
      setIdentityLable(lable?.title);
    }
    
  },[verifyData])

  const handleFormChange = (fieldName, value) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const onSubmitHandler = () => {
    if (mobile?.value === "") return;
    const payload = {
      mobile: mobile.code + mobile.value
    }
    setMobilePayload(payload);
  }

  const submitHandler = () => {
    if (newPwd === "" || confirmPwd === "") {
      if (Platform.OS === 'android') {
        ToastAndroid.show('New Password and Confirm Password is Required.', ToastAndroid.SHORT)
      } else {
        AlertIOS.alert('New Password and Confirm Password is Required.');
      }
    };
    if( newPwd !== confirmPwd) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('New Password and Confirm Password Should be Same.', ToastAndroid.SHORT)
      } else {
        AlertIOS.alert('New Password and Confirm Password Should be Same.');
      }
    };
    if(identityNumber === "") {
      if (Platform.OS === 'android') {
        ToastAndroid.show(`${identityLable} is Required.`, ToastAndroid.SHORT)
      } else {
        AlertIOS.alert(`${identityLable} is Required.`);
      }
    };
    const payload = {
      mobile : mobile.code + mobile.value,
      password : newPwd,
      id_type : verifyData?.data,
      id_number : identityNumber.replace(/-/g, '')
    }
    setResetPayload(payload);
  }

  useEffect(()=>{
    setTimeout(()=> {
    if(updateResult) navigation.navigate('SignIn')
    }, 2000)
  },[navigation, updateResult])

  return (
    <View style={styles.pageContainer}>
      <Button
        btnText="Back"
        startIcon={<EntypoIcon name="chevron-small-left" size={30} />}
        variant="secondary"
        type="text"
        onPress={() => navigation.goBack(null)}
        overridingStyles={styles.backButton}
      />
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Reset Password</Text>
        {!verifyData?.success?(
          <Text style={styles.subTitle}>
          If you've forgotten your password, don't worry. Kindly furnish your registered mobile number, enabling us to show instructions for resetting your password.
          {resetEmail ? ` Account: ${resetEmail}` : ''}
          </Text>
        ):(
          <Text style={styles.subTitle}>
            To begin the password reset process, please furnish your driving license and proceed to generate a new password, confirming it once more to guarantee precision.
        </Text>
        )}
      </View>
      {!verifyData?.success ? (<TextField
        value={mobile?.value || ""}
        label="Phone Number"
        onChange={(val) => setMobile(val)}
        returnKeyType="go"
        type="phone"
      />):(<>
      <View>
        <TextField
          value={IdProofFormat(identityNumber) || ""}
          label="Driving Licence/Voter ID"
          onChange={(val) => setIdentityNumber(val)}
          returnKeyType="go"
        /></View>
      <View>
        <TextField
          value={newPwd}
          label="New Password"
          onChange={(val) => setNewPwd(val)}
          returnKeyType="go"
          type="password"
        /></View>
        <View>
        <TextField
          value={confirmPwd}
          label="Confirm Password"
          onChange={(val) => setConfirmPwd(val)}
          returnKeyType="go"
          type="password"
        /></View>
      </>)}
      <Button
        btnText={verifyData?.success ? "Submit" : "Send Instructions"}
        size="large"
        variant="primary"
        overridingStyles={styles.sendBtn}
        btnTextOverrideStyles={styles.sendBtnText}
        onPress={verifyData?.success ? submitHandler : onSubmitHandler}
      />
      {updateResult && <Toast message={updateResult ? 'Your password was reset, Please Login again' : passError} isOpen={true} />}
    </View>
  );
};

export default ResetPassword;
