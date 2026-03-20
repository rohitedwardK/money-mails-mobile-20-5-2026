import { useEffect, useState, useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";

export const useSubCategory = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [payload, setSubCatPayload] = useState(null);
  const [subCatBrand,setSubCatBrand] = useState("");

  useEffect(() => {
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
      // setData("");
      setTimeout(async()=>{
       await fetch(`${baseUrl}/sub_category/lists?brand_uuid=${subCatBrand}&${JSON.stringify(payload)}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);

        })
        .then((result) => {

          setData( [...result]);
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      },1000)
  }, [payload]);

  return {
    subCategoryList: data,
    isCatLoading: isLoading,
    catError: error,
    setSubCatPayload,
    setSubCatBrand

  };
};
