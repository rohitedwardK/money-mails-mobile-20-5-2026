import React, {useContext, useState} from 'react';
import {View, Text} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Button from '../../../components/atoms/Button';
import Grid from '../../../components/atoms/Grid';
import TextField from '../../../components/atoms/TextField';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as newPasswordStyles} from './index.style';

const NewPassword = ({navigation}) => {
  const {isIos, screenHeight} = useContext(DeviceContext);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const styles = newPasswordStyles({screenHeight, isIos});

  const handleFormChange = (fieldName, value) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

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
        <Text style={styles.pageTitle}>Create New Password</Text>
        <Text style={styles.subTitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
        </Text>
      </View>
      <Grid
        dir="column"
        gap={screenHeight * 0.02}
        containerStyles={styles.fieldsWrapper}>
        <TextField
          value={formData.password}
          label="Password"
          onChange={value => handleFormChange('password', value)}
          returnKeyType="next"
          type="password"
        />
        <TextField
          value={formData.confirmPassword}
          label="Confirm Password"
          onChange={value => handleFormChange('confirmPassword', value)}
          returnKeyType="go"
          type="password"
        />
      </Grid>
      <Button
        btnText="Change Password"
        size="large"
        overridingStyles={styles.sendBtn}
        btnTextOverrideStyles={styles.sendBtnText}
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
};

export default NewPassword;
