import { useState, useEffect } from 'react';
import { API_KEY } from '../../App';

const useFetch = url => {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);
   const [refresh, setRefresh] = useState(false);

   const abortCont = new AbortController();

   const fetchData = async () => {
      try {
         const response = await fetch(url, {
            headers: { 'X-Api-Key': API_KEY },
            signal: abortCont.signal,
         });

         if (response.status === 200) {
            const responseData = await response.json();
            setIsLoading(false);
            setData(responseData);
         } else throw Error('Cannot fetch the given resources.');
      } catch (err) {
         if (err.name === 'AbortError') console.log('fetch is aborted..');
         else {
            setError(err.message);
            setIsLoading(false);
         }
      }
   };

   useEffect(() => {
      fetchData();

      // clean up
      return () => abortCont.abort();
   }, [url, refresh]);

   return { data, setData, isLoading, error, setRefresh };
};

export default useFetch;
