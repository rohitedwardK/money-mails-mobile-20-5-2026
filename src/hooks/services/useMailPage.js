import { useEffect, useState,useContext } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const useMailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setMailPagePayload] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [page, setPage] = useState(0);

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
      fetch(`${baseUrl}/mail/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if(page == 1){
            setData('');
            setData([...result.data]);
          }else{
            setData((prevData) => [...prevData, ...result.data]);
          }
          setIsLoading(false);
          setError(false);
        })
        .catch((err) => {
            setData(null);
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          } else {
            AlertIOS.alert(err);
          }
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);



  return {
    mailPageData : data,
    isLoading,
    error,
    setPage,
    setMailPagePayload,
  };
};
