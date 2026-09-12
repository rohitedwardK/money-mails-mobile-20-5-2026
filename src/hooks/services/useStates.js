/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';

export const useStates = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setStates] = useState(null);

  useEffect(() => {
    if(payload) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (userDetails?.token) {headers.append('x-auth-token', userDetails.token);}

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/setting/state?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setData([...result.data]);
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  return {
    stateList: data,
    isLoading,
    error,
    setStates,
  };
};
