/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const usePassword = () => {
  const { userDetails } = useContext(UserContext);
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [passError, setPassError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState(null);
  const [mobilePayload, setMobilePayload] = useState(null);
  const [verifyData, setVerifyData] = useState();
  const [resetPayload, setResetPayload] = useState();
  const [updateResult, setUpdateResult] = useState(false);
  const [isRequest, setIsRequest] = useState(false);

  const onPassword = () => {
    setIsPassLoading(true);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (userDetails?.token) {headers.append('x-auth-token', userDetails.token);}

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: 'PUT',
        headers: headers,
        body: params,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/user/consumer/update/password`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setData(result);
          setPassError(false);
          setIsPassLoading(false);
        })
        .catch((err) => {
          setPassError(err);
          setIsPassLoading(false);
        });
  };

  useEffect(() => {
    if(payload) {
        onPassword();
    }
  }, [payload]);

  const verifyMobile = () => {
    setIsPassLoading(true);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (userDetails?.token) {headers.append('x-auth-token', userDetails.token);}

      const params = JSON.stringify(mobilePayload);

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: params,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/user/consumer/verify`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setVerifyData({...result});
          setPassError(false);
          setIsPassLoading(false);
        })
        .catch((err) => {

          setPassError(err);
          setIsPassLoading(false);
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          } else {
            AlertIOS.alert(err);
          }
        });
  };

  useEffect(() => {
    if(mobilePayload) {
        verifyMobile();
    }
  }, [mobilePayload]);

  const ResetPassword = () => {
    setIsPassLoading(true);
    setIsRequest(false);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (userDetails?.token) {headers.append('x-auth-token', userDetails.token);}

      const params = JSON.stringify(resetPayload);

      const requestOptions = {
        method: 'PUT',
        headers: headers,
        body: params,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/user/consumer/change/password`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setVerifyData({...result});
          setUpdateResult(true);
          setPassError(false);
          setIsPassLoading(false);
          setIsRequest(true);
        })
        .catch((err) => {
          if (Platform.OS === 'android') {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          } else {
            AlertIOS.alert(err);
          }
          setPassError(err);
          setIsPassLoading(false);
          setUpdateResult(false);
          setIsRequest(true);
        });
  };

  useEffect(() => {
    if(resetPayload) {
        ResetPassword();
    }
  }, [resetPayload]);

  return {
    data,
    isPassLoading,
    passError,
    isRequest,
    verifyData,
    updateResult,
    setPayload,
    setMobilePayload,
    setResetPayload,
  };
};
