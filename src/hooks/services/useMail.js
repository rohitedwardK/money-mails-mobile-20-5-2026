import { useEffect, useState, useContext, useCallback } from "react";
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
  const [redeemMessage, setRedeemMessage] = useState("");
  const [redeemSuccessMessage, setRedeemSuccessMessage] = useState("");
  const [updateMailRedeem, setUpdateMailRedeem] = useState();
  const [count, setCount] = useState(0);
  const [mailURL, setMailURL] = useState("");
  const [mailHTML, setMailHTML] = useState("");
  const [unsubscribeMail, setUnsubscribeMail] = useState(null);
  const [unsubscribeResult, setUnsubscribeResult] = useState("");
  const [unsubscribeError, setUnsubscribeError] = useState("");

  const buildHeaders = useCallback(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (userDetails?.token) {
      headers.append("x-auth-token", userDetails.token);
    }
    return headers;
  }, [userDetails?.token]);

  const parseResponse = async response => {
    const res = await response.text();
    if (response.status !== 200) {
      throw res;
    }
    return JSON.parse(res);
  };

  const onMailLoad = useCallback(() => {
    if (!payload) return;
    setIsLoading(true);

    const requestOptions = {
      method: "GET",
      headers: buildHeaders(),
      redirect: "follow",
    };

    fetch(`${baseUrl}/mail/list?${payload}`, requestOptions)
      .then(parseResponse)
      .then(result => {
        setData([...result.data]);
        setCount(result?.count || 0);
        setError(false);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [buildHeaders, payload]);

  useEffect(() => {
    if (!payload) return;
    onMailLoad();
    const intervalID = setInterval(() => {
      onMailLoad();
    }, 30000);
    return () => clearInterval(intervalID);
  }, [payload, onMailLoad]);

  useEffect(() => {
    if (!updateMailFav) return;
    setIsLoading(true);

    const requestOptions = {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(updateMailFav),
      redirect: "follow",
    };

    fetch(`${baseUrl}/mail/update/favourite`, requestOptions)
      .then(parseResponse)
      .then(() => {
        onMailLoad();
        setError(false);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [updateMailFav, buildHeaders, onMailLoad]);

  useEffect(() => {
    if (!updateMailRedeem?.mail_uuid) return;
    setIsLoading(true);
    setRedeemSuccessMessage("");

    const requestOptions = {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(updateMailRedeem),
      redirect: "follow",
    };

    fetch(`${baseUrl}/mail/update/redeem`, requestOptions)
      .then(parseResponse)
      .then(result => {
        setRedeemSuccessMessage(result?.message || "");
        onMailLoad();
        setRedeemError(false);
        setIsRedeem(true);
      })
      .catch(err => {
        setRedeemError(true);
        setRedeemMessage(`${err}`);
        setIsRedeem(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [updateMailRedeem, buildHeaders, onMailLoad]);

  useEffect(() => {
    if (!mailURL?.html_url) return;
    setIsLoading(true);

    const requestOptions = {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(mailURL),
      redirect: "follow",
    };

    fetch(`${baseUrl}/mail/read/html/file`, requestOptions)
      .then(parseResponse)
      .then(result => {
        setMailHTML(result?.htmlData || "");
      })
      .catch(() => {
        setMailHTML("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [mailURL, buildHeaders]);

  useEffect(() => {
    if (!unsubscribeMail?.mail_uuid) return;
    setUnsubscribeError("");
    setUnsubscribeResult("");
    setIsLoading(true);

    const requestOptions = {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(unsubscribeMail),
      redirect: "follow",
    };

    fetch(`${baseUrl}/mail/unsubscribe`, requestOptions)
      .then(parseResponse)
      .then(result => {
        setUnsubscribeResult(result?.message || "Mail unsubscribed successfully.");
        onMailLoad();
      })
      .catch(err => {
        setUnsubscribeError(`${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [unsubscribeMail, buildHeaders, onMailLoad]);

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
    unsubscribeResult,
    unsubscribeError,
    setMailPayload,
    setUpdateMailFav,
    setUpdateMailRedeem,
    setMailURL,
    setUnsubscribeMail,
  };
};
