import { useEffect, useState } from "react";
import { baseUrl } from "../../connections";

export const useCountyData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setCountyData] = useState(null);

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

      fetch(`${baseUrl}/county/list/by/state/${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          const countyData = result?.data.map((val) => {
            const item = val;
            item.value = val.uuid;
            item.label = val.name;
            return item;
          });
          if(countyData.length != ""){
            countyData[countyData.length] = {
              value : "other",
              label : "Other"
            }
          }
          setData(countyData);
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
    countyData: data,
    isLoading,
    error,
    setCountyData,
  };
};
