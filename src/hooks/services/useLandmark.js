import { useEffect, useState } from "react";
import { baseUrl } from "../../connections";

export const useLandmarkData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setLandmarkPayload] = useState(null);

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

      fetch(`${baseUrl}/pincode/housing/communities/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {

          const landmarkData = result?.map((val) => {
            const item = val;
            item.value = val.landmark;
            item.label = val.landmark;
            return item;
          });
          setData(landmarkData);
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
    landmarkData: data,
    isLoading,
    error,
    setLandmarkPayload,
  };
};
