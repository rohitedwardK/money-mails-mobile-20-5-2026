import { useEffect, useState } from "react";
import { baseUrl } from "../../connections";

export const useVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [payload, setOTPPayload] = useState(null);

  useEffect(() => {
    if (payload && Object.keys(payload).length > 0) {
      setIsLoading(true);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("x-auth-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmY0YWQ4OGNjMDA1ZWRjMWU2ZGRjZGEiLCJ1dWlkIjoiQ04tN0MyRkQ4N0UiLCJncm91cCI6ImNvbnN1bWVyIiwiZW1haWwiOiJhYXNoaWZAc2NpZW5zdGVjaG5vbG9naWVzLmluIiwibW9iaWxlIjoiKzkxODg3Nzk5NzczOCIsImlhdCI6MTY2NDE3NTQyM30.UA3bcXurKzO3mOISJroE8r_V4kYDhdpLPXM8HNrBml4");

      const body = JSON.stringify(payload);

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: body,
        redirect: "follow",
      };

      fetch(`${baseUrl}/user/verify/by/code`, requestOptions)
        .then(async (response) => {
          const res = await response.text();
          if (response.status !== 200) {
            throw res;
          }
          return JSON.parse(res);
        })
        .then((result) => {
          if (result.suucees) {
            setIsOTPVerified(true);
            setIsLoading(false);
            setError(false);
          } else {
            throw "Something went wrong! Please try again later.";
          }
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [payload]);

  return {
    isOTPVerified,
    isLoading,
    error,
    setOTPPayload,
  };
};
