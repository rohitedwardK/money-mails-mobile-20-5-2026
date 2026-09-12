import { useEffect, useState, useContext } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';

export const useHome = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if(payload) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('x-auth-token', userDetails?.token);

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/add/get?${payload}`, requestOptions)
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
    data,
    isLoading,
    error,
    setPayload,
  };
};
