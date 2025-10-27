import { useState, useEffect, useRef } from 'react';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const cache = new Map<string, { data: any; timestamp: number; checksum?: number }>();

interface UseCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<T | undefined>;
  invalidate: () => void;
}

export const useCache = <T,>(
  key: string | (() => string),
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
): UseCacheResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = async (forceRefresh = false): Promise<T | undefined> => {
    const cacheKey = typeof key === 'function' ? key() : key;
    const now = Date.now();
    const cached = cache.get(cacheKey);

    // Verificar se tem cache válido e não é refresh forçado
    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      if (mountedRef.current) {
        setData(cached.data);
        setLoading(false);
      }
      return cached.data;
    }

    // Se não tem cache válido, buscar do servidor
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();

      if (mountedRef.current) {
        // Salvar no cache
        cache.set(cacheKey, {
          data: result,
          timestamp: now,
        });

        setData(result);
        setLoading(false);
      }

      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
        setLoading(false);
      }
      throw err;
    }
  };

  const invalidateCache = () => {
    const cacheKey = typeof key === 'function' ? key() : key;
    cache.delete(cacheKey);
  };

  const refreshData = () => {
    return fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refresh: refreshData,
    invalidate: invalidateCache,
  };
};

// Função auxiliar para invalidar múltiplas chaves
export const invalidateCacheKeys = (keys: string[]) => {
  keys.forEach(key => cache.delete(key));
};

// Função para limpar todo o cache
export const clearAllCache = () => {
  cache.clear();
};

// Função para obter timestamp do cache (para indicador visual)
export const getCacheTimestamp = (key: string): number | null => {
  const cached = cache.get(key);
  return cached ? cached.timestamp : null;
};
