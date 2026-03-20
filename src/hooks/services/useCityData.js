import { useEffect, useState } from "react";
import { baseUrl } from "../../connections";

export const useCityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setCityData] = useState(null);


  useEffect(() => {
    if(payload) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      fetch(`${baseUrl}/city/list/by/county/${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          const cityData = result?.data.map((val) => {
            const item = val;
            item.value = val.uuid;
            item.label = val.name;
            return item;
          });
          if(cityData.length != ""){
            cityData[cityData.length] = {
              value : "other",
              label : "Other"
            }
          }
          setData(cityData);
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
    cityData: data,
    isLoading,
    error,
    setCityData,
  };
};
