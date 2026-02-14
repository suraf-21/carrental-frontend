// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (fetchFunction, params = null, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (queryParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(queryParams || params);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, setData };
};