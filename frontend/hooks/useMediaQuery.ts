import { useState, useEffect } from "react";



const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    documentChangeHandler(); // Set the initial value

    mediaQueryList.addListener(documentChangeHandler);

    return () => {
      mediaQueryList.removeListener(documentChangeHandler);
    };
  }, [query]);

  return matches;
};

export { useMediaQuery };


// Define the hook with 'query' parameter typed as a string
const useMediaQueries = (): string => {
  const [matches, setMatches] = useState<boolean>(false);

  const queries = {
    small: '(max-width:767px)', // (max-width:639px) and
    medium: '(min-width:768px) and (max-width:1023px)',
    large: '(min-width:1024px) and (max-width:1279px)',
    extralarge: '(min-width:1280px)',
  };  

  const [screenSize, setScreenSize] = useState('medium');

  useEffect(() => {
    const getScreenSize = () => {
      if (window.matchMedia(queries.small).matches) return 'small';
      if (window.matchMedia(queries.medium).matches) return 'medium';
      if (window.matchMedia(queries.large).matches) return 'large';
      if (window.matchMedia(queries.extralarge).matches) return 'extralarge';
      return 'unknown';
    };

    const handleChange = () => {
      setScreenSize(getScreenSize());
    };

    const mediaQueryLists = Object.values(queries).map(query => window.matchMedia(query));
    mediaQueryLists.forEach(mql => mql.addEventListener('change', handleChange));

    handleChange();

    return () => {
      mediaQueryLists.forEach(mql => mql.removeEventListener('change', handleChange));
    };
  }, [queries]);

  return screenSize;
};

export { useMediaQueries };