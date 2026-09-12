import { useEffect, useState, useContext } from 'react';
import { baseUrl } from '../../connections';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCategory = () => {
  const { userDetails,activeCategory } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [catList, setCatList] = useState(null);
  const [payload, setCatPayload] = useState(null);
  const [catDetaisPayload, setCatDetailsPayload] = useState();
  const [catDetails, setCatDetails] = useState();
  const [point, setPoint] = useState(0);
  const [pege, SetPege] = useState(0);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('x-auth-token', userDetails?.token);

  useEffect(() => {
    if(payload) {
    setIsLoading(true);
      const params = JSON.stringify(payload);
      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };
      fetch(`${baseUrl}/category/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          const categoryData = result?.map((val) => {
            const item = val;
            item.id = val.uuid;
            item.title = `${val.name} (${val.mails_count})`;
            return item;
          });
          // categoryData.unshift(categoryData.splice(categoryData.findIndex(elt => elt.uuid === activeCategory?.uuid), 1)[0]);

          setData(categoryData);
          setCatList(categoryData);
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      }
  }, [payload]);

  useEffect(()=>{
     let intervalIDS = setInterval(async()=>{
      let key = Math.random();
      if(payload){
        setCatPayload(`key1=${key}&${payload}`);
      }
      // const userToken = await AsyncStorage.getItem('user');
      // if(userToken){
      //   let user = JSON.parse(userToken)
      //   setCatPayload(`key=${key}&search=&user_uuid=${user?.uuid}`);

      // }
     },5000);
     return ()=> clearInterval(intervalIDS);
  },[]);

  useEffect(() => {
    if(catDetaisPayload) {
    setIsLoading(true);
      const params = JSON.stringify(catDetaisPayload);
      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/mail/user/point/history?${catDetaisPayload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if(pege == 0){
            setCatDetails( [...result.data]);
          }else{
            setCatDetails((prevData) => [...prevData, ...result.data]);
          }
          setPoint(result?.point);
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      }
  }, [catDetaisPayload]);

  return {
    catList,
    setCatList,
    categoryList: data,
    setData,
    isCatLoading: isLoading,
    catError: error,
    catDetails,
    setCatPayload,
    setCatDetails,
    setCatDetailsPayload,
    point,
    SetPege,
  };
};
