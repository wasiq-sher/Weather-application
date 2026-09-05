import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient.js';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  const execute = useCallback(async (customOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(endpoint, { ...options, ...customOptions });
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (!options.manual) {
      execute();
    }
  }, [execute, options.manual]);

  return { data, loading, error, refetch: execute };
}
