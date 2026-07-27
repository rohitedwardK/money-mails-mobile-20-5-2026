/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { baseUrl } from "../../connections";
import { UserContext } from "../../context/UserContext";

export const useMail = () => {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [payload, setMailPayload] = useState(null);
  const [updateMailFav, setUpdateMailFav] = useState();
  const [redeemError, setRedeemError] = useState(false);
  const [isRedeem, setIsRedeem] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');
  const [redeemSuccessMessage,setRedeemSuccessMessage] = useState('');
  const [updateMailRedeem, setUpdateMailRedeem] = useState();
  const [count, setCount] = useState(0);
  const [mailURL, setMailURL] = useState('');
  const [mailHTML, setMailHTML] = useState('');

  const onMailLoad = () => {
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
      // country_uuid=CO-42A82D09&state_uuid=ST-D8830887&city_uuid=CITY-DF2C30CF&sub_category_uuid=SCAT-AA55973A&user_uuid=CN-DE684BE9&county_uuid=CNTY-2C7F097B&brand_uuid=&category_uuid=CAT-AB727D5A&type=filter&seen=
      // fetch(`${baseUrl}/mail/list?${payload}&seen=`, requestOptions)
      fetch(`${baseUrl}/mail/list?${payload}`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          // const dsfdsf = [...result.data]
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
      onMailLoad();
      const intervalID =  setInterval(()=>{
        onMailLoad()
      },30000);
      return ()=> clearInterval(intervalID)
    }
  }, [payload]);

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
          onMailLoad();
          setError(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [updateMailFav]);

  useEffect(() => {
    if(updateMailRedeem) {
    if(!updateMailRedeem?.mail_uuid) return;
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const params = JSON.stringify(updateMailRedeem);

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: params,
        redirect: "follow",
      };
      setRedeemSuccessMessage('');
      fetch(`${baseUrl}/mail/update/redeem`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          let messageJson =  JSON.parse(res);
          setRedeemSuccessMessage(messageJson.message);
          return JSON.parse(res);
        })
        .then((result) => {
          onMailLoad();
          setRedeemError(false);
          setIsRedeem(true);
        })
        .catch((err) => {
          setRedeemError(true);
          setRedeemMessage(err);
          setIsRedeem(true);
        });
    }
  }, [updateMailRedeem]);

  useEffect(() => {
    if(mailURL) {
    if(!mailURL) return;
    setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", userDetails?.token);

      const params = JSON.stringify(mailURL);

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: params,
        redirect: "follow",
      };

      fetch(`${baseUrl}/mail/read/html/file`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          setMailHTML(result?.htmlData)
        })
        .catch((err) => {
          // console.log('result', err);
        });
    }
  }, [mailURL]);

  return {
    mailList: data,
    mailCount: count,
    isMailLoading: isLoading,
    mailError: error,
    redeemError,
    isRedeem,
    redeemMessage,
    redeemSuccessMessage,
    mailHTML,
    setMailPayload,
    setUpdateMailFav,
    setUpdateMailRedeem,
    setMailURL
  };
};
