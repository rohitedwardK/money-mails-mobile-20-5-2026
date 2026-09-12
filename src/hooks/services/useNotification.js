import { useEffect, useState, useContext } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const useNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setNotificationPayload] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [count, setCount] = useState(0);
  const [page, setPege] = useState(0);

  useEffect(() => {
    if (payload) {
      setIsLoading(true);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('x-auth-token', userDetails?.token);

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };
      fetch(`${baseUrl}/notification/list/consumer?limit=10&user_uuid=${payload.user_uuid}&page=${payload.page}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if (page == 0) {
            setData([]);
            setData([...result.data]);
          } else {
            setData((prevData) => [...prevData, ...result.data]);
          }
          setCount(result.unread);
          setIsLoading(false);
          setError(false);
        })
        .catch((err) => {
          setData(null);
          // if (payload?.user_uuid) {
          //   if (Platform.OS === 'android') {
          //     ToastAndroid.show(err, ToastAndroid.SHORT)
          //   } else {
          //     AlertIOS.alert(err);
          //   }
          // }
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);



  return {
    data,
    isLoading,
    error,
    count,
    setPege,
    setNotificationPayload,
  };
};
