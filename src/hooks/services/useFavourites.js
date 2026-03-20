import { useEffect, useState, useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";

export const useFavourites = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [payload, setFavPayload] = useState(null);
  const [updateMailFav, setUpdateMailFav] = useState();
  const [updateBrandFav, setUpdateBrandFav] = useState();

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-auth-token", userDetails?.token);

  const onBrandLoad = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    fetch(`${baseUrl}/favourite/brand/list?${payload}`, requestOptions)
          .then(async (response) => {
            const res = await response.text();
            if (response.status !== 200) {
              throw res;
            }
            return JSON.parse(res);
          })
          .then((result) => {
            setBrandData((prevData) => [...prevData, ...result.data]);
            setError(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setError(err);
            setIsLoading(false);
          });
  }

  const onMailLoad = () => {
    setIsLoading(true);
    const params = JSON.stringify(payload);

    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    fetch(`${baseUrl}/favourite/mail/list?${payload}`, requestOptions)
      .then(async (response) => {
        const res = await response.text();
        if (response.status !== 200) {
          throw res;
        }
        return JSON.parse(res);
      })
      .then((result) => {
        setMailData(result.data);
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
      onMailLoad();
      onBrandLoad();
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

  useEffect(() => {
    if(updateMailFav) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const params = JSON.stringify(updateMailFav);

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: params,
        redirect: "follow",
      };

      fetch(`${baseUrl}/mail/update/favourite`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if(payload !== null) onMailLoad();
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [updateMailFav]);

  return {
    mailData,
    brandData,
    isLoading,
    error,
    setFavPayload,
    setUpdateBrandFav,
    setUpdateMailFav
  };
};
