/**
* InvalidQueryParams checks for incorrect query parameter(s)
*
* @param {obj}     queryParams - object of request URL query params (AWS)
* @param {arr}     whiteList - array of allowed params; per implementation
* @return {arr}    returns array of bad parameters, or empty array
*/
export const FindInvalidQueryParams = (queryParams, whiteList) => (
    Object.keys(queryParams).filter(parameter => (
      !whiteList.includes(parameter)
    ))
  );

  