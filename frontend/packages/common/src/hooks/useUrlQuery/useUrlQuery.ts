import { useSearchParams } from 'react-router-dom';

export interface UrlQueryObject {
  [key: string]: string | string[] | number | boolean | null | object;
}

interface useUrlQueryProps {
  // an array of keys - the values of which should not be parsed before returning
  // by default the value of parameters will be coerced to a number if !isNaN
  // and to boolean if 'true' or 'false'. Specify keys here if you wish to opt out of this
  skipParse?: string[];
}
export const useUrlQuery = ({ skipParse = [] }: useUrlQueryProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQuery = (values: UrlQueryObject, overwrite = false) => {
    // needed to handle possibility of multiple `updateQuery` calls in same render
    // `searchParams` is cached until end of render
    const currentSearchParams = new URLSearchParams(window.location.search);
    const newQueryObject = overwrite
      ? {}
      : Object.fromEntries(currentSearchParams.entries());

    Object.entries(values).forEach(([key, value]) => {
      if (!value) delete newQueryObject[key];
      else newQueryObject[key] = String(value);
    });

    setSearchParams(newQueryObject, { replace: true });
  };

  return {
    urlQuery: parseSearchParams(searchParams, skipParse),
    updateQuery,
  };
};

// Coerces url params to appropriate type
const parseSearchParams = (
  searchParams: URLSearchParams,
  skipParse: string[]
) =>
  Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => {
      if (skipParse.includes(key)) return [key, value];
      if (!isNaN(Number(value))) return [key, Number(value)];
      if (value === 'true') return [key, true];
      if (value === 'false') return [key, false];
      if (key.endsWith('[]')) {
        // if the key ends with '[]' then the value should be an array of strings
        return [key.replace('[]', ''), value.split(',')];
      }
      return [key, value];
    })
  );
