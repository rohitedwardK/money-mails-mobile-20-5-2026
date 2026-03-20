import { useEffect, useState,useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const usePointRedeemHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setRedeemPayload] = useState(null);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    if (payload) {
      setIsLoading(true);
     
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };
      fetch(`${baseUrl}/point/redeemed/history/list?limit=10&search=&user_uuid=${payload.user_uuid}&page=${payload.page}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
            setData((prevData) => [...prevData, ...result.data]);
            setIsLoading(false);
            setError(false);
        })
        .catch((err) => {
            setData(null)
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT)
          } else {
            AlertIOS.alert(err);
          }
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);



  return {
    data,
    isLoading,
    error,
    setRedeemPayload
  };
};
