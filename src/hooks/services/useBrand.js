/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";

export const useBrand = () => {
  const { userDetails } = useContext(UserContext);
  const [isBrandLoading, setIsLoading] = useState(false);
  const [brandError, setError] = useState(false);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [payload, setBrandPayload] = useState(null);
  const [updateBrandFav, setUpdateBrandFav] = useState();

  const onBrandLoad = () => {
    // setData([]);
    setIsLoading(true);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      // console.log(`HERE I AM Brand: brand/list?${payload}`);

      fetch(`${baseUrl}/user/brand/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {

          setData([...result.data]);
          setCount(result?.count);
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
  }

  useEffect(() => {
    if(payload) {
      onBrandLoad();
     const intervalID =  setInterval(()=>{
        onBrandLoad();
      },30000);
      return ()=> clearInterval(intervalID)
    }
  }, [payload]);

  useEffect(() => {
    if(updateBrandFav) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const params = JSON.stringify(updateBrandFav);

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: params,
        redirect: "follow",
      };

      fetch(`${baseUrl}/favourite`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          onBrandLoad();
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [updateBrandFav]);

  return {
    barndList: data,
    brandCount: count,
    isBrandLoading,
    brandError,
    setBrandPayload,
    setUpdateBrandFav
  };
};
