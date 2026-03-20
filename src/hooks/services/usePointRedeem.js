import { useEffect, useState,useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";
import {
  ToastAndroid,
  Platform,
  AlertIOS,
  Alert
} from 'react-native';
import Toast from '../../components/atoms/Snackbar';

export const usePointRedeem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [payload, setRedeemPayload] = useState(null);
  const [payloads, setRedeemPayloads] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [datas, setDatas] = useState(null);

  useEffect(() => {
    if (payload && payload.user_uuid && payload.point) {
      setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const body = JSON.stringify(payload);
      const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow",
      };
      fetch(`${baseUrl}/point/redeemed/check`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
            setData({ ...result });
            setIsLoading(false);
            setError(false);
        })
        .catch((err) => {
            setData(null)
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT)
          } else {
            Alert.alert('Alert', err, [
              {
                  text: 'ok',
                  onPress: str => console.log('Entered string: ' + str),
              },
              
          ]);
          }
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  useEffect(() => {
    if (payloads && payloads.user_uuid && payloads.point) {
      setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const body = JSON.stringify(payloads);
      const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow",
      };
      fetch(`${baseUrl}/point/redeemed`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
            setDatas({ ...result });
            setIsLoading(false);
            setError(false);
        })
        .catch((err) => {
            setDatas(null)
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT)
          } else {
            // AlertIOS.alert(err);
            return <Toast message={err} isOpen={true} />
          }
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payloads]);

  return {
    data,
    isLoading,
    error,
    setRedeemPayload,
    setRedeemPayloads,
    datas
  };
};
