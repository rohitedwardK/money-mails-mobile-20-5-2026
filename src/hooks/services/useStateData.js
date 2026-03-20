import { useEffect, useState } from "react";
import { baseUrl } from "../../connections";

export const useStateData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setStateData] = useState(null);

  useEffect(() => {
    if(payload) {
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmY0YWQ4OGNjMDA1ZWRjMWU2ZGRjZGEiLCJ1dWlkIjoiQ04tN0MyRkQ4N0UiLCJncm91cCI6ImNvbnN1bWVyIiwiZW1haWwiOiJhYXNoaWZAc2NpZW5zdGVjaG5vbG9naWVzLmluIiwibW9iaWxlIjoiKzkxODg3Nzk5NzczOCIsImlhdCI6MTY2NDE3NTQyM30.UA3bcXurKzO3mOISJroE8r_V4kYDhdpLPXM8HNrBml4");

      const params = JSON.stringify(payload);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      fetch(`${baseUrl}/state/list/by/country/${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          const stateData = result?.data.map((val) => {
            const item = val;
            item.value = val.uuid;
            item.label = val.name;
            return item;
          });
          setData(stateData);
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
    stateData: data,
    isLoading,
    error,
    setStateData,
  };
};
