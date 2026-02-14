// src/hooks/usePagination.js
import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNumber) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  return {
    page,
    limit,
    total,
    setTotal,
    setLimit,
    nextPage,
    prevPage,
    goToPage
  };
};