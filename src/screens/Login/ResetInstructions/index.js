import React, {useContext, useState} from 'react';
import {View, Text} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Button from '../../../components/atoms/Button';
import MailIllustration from '../../../assets/images/mailIllustration';
import {openInbox} from 'react-native-email-link';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as sesetInstructionsStyles} from './index.style';

const ResetInstructions = ({navigation}) => {
  const {isIos, screenHeight} = useContext(DeviceContext);
  const [formData, setFormData] = useState({
    phone: '',
  });

  const styles = sesetInstructionsStyles({screenHeight, isIos});

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
        <Text style={styles.pageTitle}>Check your Mail</Text>
        <Text style={styles.subTitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
        </Text>
      </View>
      <MailIllustration height="15%" />
      <Button
        btnText="Open Email"
        size="large"
        overridingStyles={styles.sendBtn}
        btnTextOverrideStyles={styles.sendBtnText}
        onPress={openInbox}
      />
      <Button
        btnText=""
        variant="secondary"
        type="link"
        linkpreText="Skip, I'll confirm later"
        overridingStyles={styles.skipBtn}
        onPress={() => navigation.navigate('NewPassword')}
        btnTextOverrideStyles={styles.skipBtnText}
      />
    </View>
  );
};

export default ResetInstructions;
