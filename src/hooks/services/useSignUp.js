import { useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { baseUrl } from '../../connections';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {

    if (payload && Object.keys(payload).length > 0) {
      setIsLoading(true);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const body = JSON.stringify(payload);

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/user/register`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if (result.message === 'Register Successfully!') {
            Snackbar.show({
              text: result.message,
              duration: Snackbar.LENGTH_SHORT,
            });
            setData({ ...result.data });
            setIsLoading(false);
            setError(false);
          } else {
            throw 'Something went wrong! Please try again later.';
          }
        })
        .catch((err) => {
          Snackbar.show({
            text: err,
            duration: Snackbar.LENGTH_SHORT,
          });
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  return {
    data,
    isLoading,
    error,
    setPayload,
  };
};
