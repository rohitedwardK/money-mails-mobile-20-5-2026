/* eslint-disable react-hooks/exhaustive-deps */
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
    if (!payload || !userDetails?.uuid || !userDetails?.token) {
      return;
    }

    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };
      // setData("");
      setTimeout(async()=>{
        const brandParam = Array.isArray(subCatBrand)
          ? subCatBrand.filter(Boolean).join(',')
          : subCatBrand || '';
        const query = String(payload || '').replace(/^\?/, '');
        const brandQuery = brandParam ? `brand_uuid=${brandParam}&` : '';

       await fetch(`${baseUrl}/sub_category/lists?${brandQuery}${query}`, requestOptions)
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
  }, [payload, subCatBrand, userDetails?.token, userDetails?.uuid]);

  return {
    subCategoryList: data,
    isCatLoading: isLoading,
    catError: error,
    setSubCatPayload,
    setSubCatBrand

  };
};
