import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, Linking } from 'react-native';
import { baseUrl } from "../connections";
import axios from 'axios';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export async function requestUserPermission() {
//   const authStatus = await messaging().hasPermission();
//   // const enabled =
//   //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//   //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   console.log(authStatus, "enabled")

//   // if (enabled) {
//   //   getFCMToken();
//   // }
// }

export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    const androidVersion = parseInt(Platform.constants.Release, 10);

    if (androidVersion >= 13) {
      let permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS || 'android.permission.POST_NOTIFICATIONS';

      // if (!permission) {
      //   console.log(Platform.Version, PERMISSIONS.ANDROID, "PERMISSIONS.ANDROID")
      //   console.warn("POST_NOTIFICATIONS permission is undefined. Check Android version or library.");
      //   return false;
      // }

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        getFCMToken();
        console.log("✅ Android: Notifications permission granted");
        return true;
      }

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        getFCMToken();
        console.log("✅ Android: Permission granted after request");
        return true;
      } else {
        console.log("❌ Android: Permission denied or blocked");
        showNotificationSettingsPrompt();
        return false;
      }
    } else {
      console.log("✅ Android: <13: No runtime permission needed");
      return true;
    }
  } else {
    // iOS
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ iOS: Permission granted");
      getFCMToken();
      return true;
    } else {
      console.log("❌ iOS: Permission denied");
      showNotificationSettingsPrompt();
      return false;
    }
  }
}

function showNotificationSettingsPrompt() {
  Alert.alert(
    "Enable Notifications",
    "Notifications are turned off. Please enable them in your phone's settings.",
    [
      { text: "Open Settings", onPress: () => Linking.openSettings() },
      { text: "Cancel", style: "cancel" }
    ]
  );
}

const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {

    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    } catch (error) {
      console.log(error, ' : Error raised.')
    }
  }
}

export const saveFCMToken = async (user_uuid) => {

  let fcmToken = await messaging().getToken();
  const device_type = (Platform.OS === 'ios') ? 'ios' : 'andriod';

  await axios.post(`${baseUrl}/firebase/save`, {
    firebasetoken: fcmToken,
    user_uuid: user_uuid,
    device_type: device_type
  })
    .then(function (response) {
      console.log(response, "token save");
    })
    .catch(function (error) {
      console.log(error, 'token save error');
    });

}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging.onMessage(async remoteMessage => {
    console.log('received in foregoround,', remoteMessage)
  })

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
}