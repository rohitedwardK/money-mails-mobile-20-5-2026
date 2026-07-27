import { useEffect, useState,useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';

export const useBrandPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [page,setPage] = useState(0);
  const [payload, setBrandPagePayload] = useState(null);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    if (payload && userDetails?.token) {
      setIsLoading(true);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };
      fetch(`${baseUrl}/user/brand/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          const isFirstPage = /(?:^|&)pagenum=0(?:&|$)/.test(payload);
          setData(current =>
            isFirstPage ? [...result.data] : [...current, ...result.data],
          )
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
  }, [payload, userDetails?.token]);


  return {
    brandPageData : data,
    isLoading,
    setPage,
    error,
    setBrandPagePayload
  };
};
