import { useEffect, useState, useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";

export const usePopUpAds = () => {
  const { userDetails } = useContext(UserContext); // Use user context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const [payload, setPopUpAds] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);
      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };
      try {
        await fetch(
          `${baseUrl}/modal/list${payload}`, requestOptions
        )
          .then(async (response) => {
            const res = await response.text();
            if (response.status !== 200) {
              throw res;
            }
            return JSON.parse(res);
          })
          .then((result) => {
            console.log(result?.data, "result?.data")
            setData(result?.data);
          })
          .catch((err) => {
            console.log(result?.data, "result?.data err")
            setData(null);
          });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [payload]);

  return { PopUpAddData: data, isLoading, error, setPopUpAds }; // Returning the state and setSubCatPayload function
};