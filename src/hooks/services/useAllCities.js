import {useEffect, useState} from 'react';
import {baseUrl} from '../../connections';

export const useAllCities = () => {
  const [cityList, setCityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`${baseUrl}/city/list/all?pagenum=0&limit=100&search=`, {
      signal: controller.signal,
    })
      .then(async response => {
        const body = await response.text();
        if (!response.ok) throw new Error(body || 'Unable to load cities.');
        return JSON.parse(body);
      })
      .then(result => {
        setCityList(Array.isArray(result?.data) ? result.data : []);
        setError(null);
      })
      .catch(fetchError => {
        if (fetchError?.name !== 'AbortError') setError(fetchError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return {cityList, isLoading, error};
};
