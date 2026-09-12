/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';

export const useVerification = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [payload, setOTPPayload] = useState(null);

  useEffect(() => {
    if (payload && Object.keys(payload).length > 0) {
      setIsLoading(true);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (userDetails?.token) {headers.append('x-auth-token', userDetails.token);}

      const body = JSON.stringify(payload);

      const requestOptions = {
        method: 'PUT',
        headers: headers,
        body: body,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/user/verify/by/code`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if (result.suucees) {
            setIsOTPVerified(true);
            setIsLoading(false);
            setError(false);
          } else {
            throw 'Something went wrong! Please try again later.';
          }
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  return {
    isOTPVerified,
    isLoading,
    error,
    setOTPPayload,
  };
};
