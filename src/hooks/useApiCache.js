import { useState, useEffect, useRef } from 'react';

// 간단한 API 캐싱 훅
export const useApiCache = (key, fetcher, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());
  const { cacheTime = 5 * 60 * 1000 } = options; // 5분 기본 캐시

  useEffect(() => {
    const fetchData = async () => {
      // 캐시 확인
      const cached = cache.current.get(key);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        
        // 캐시 저장
        cache.current.set(key, {
          data: result,
          timestamp: Date.now(),
        });
        
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchData();
    }
  }, [key, fetcher, cacheTime]);

  return { data, loading, error };
};

// 사용 예시:
// const { data: categories, loading } = useApiCache(
//   'categories', 
//   () => callApi('get', '/q/category')
// );
