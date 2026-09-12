import { useEffect, useState } from 'react';
import { baseUrl } from '../../connections';
import Snackbar from 'react-native-snackbar';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [payload, setPayload] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (payload && payload.username && payload.password) {
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

      fetch(`${baseUrl}/user/login`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setData({ ...result.data, token: result.token, bingo : result.bingoDetail });
          setError(false);
          if(result.data.user_verified){
            Snackbar.show({
              text: 'User Logged in Successfully.',
              duration: Snackbar.LENGTH_SHORT,
            });
          }else{
            Snackbar.show({
              text: 'Verification Pending',
              duration: Snackbar.LENGTH_SHORT,
            });
          }

          setIsLoading(false);
        })
        .catch((err) => {
          Snackbar.show({
            text: err,
            duration: Snackbar.LENGTH_SHORT,
          });
          setError(true);
          setMessage(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  return {
    data,
    isLoading,
    error,
    message,
    setPayload,
    setData,
  };
};
