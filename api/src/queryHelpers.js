import testData from "../data.json";

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

/**
* PrepareDgraphItemQuery creates query for Dgraph based on query parameter(s)
* Assumes parameter(s) have already been validated
*
* @param {obj}     queryParams - object of request URL query params from REST api request
* @return {string}    returns Dgraph queryText
*/
export const PrepareDgraphItemQuery = (queryParams) => {
  const { code } = queryParams;
  const { search } = queryParams;
  const fieldsToRequest = `{	
    code
    description
    type
    value
    has_property
    has_child
  }`

  console.log(queryParams);

  if (code){
    return `{
        find_by_code(func: eq(code, ${code})) @recurse(depth: 9)
        ${fieldsToRequest}
      }`;
    
  } else if (search) {
    return `{
        find_by_description(func: eq(description, ${search})) @recurse(depth:9)
        ${fieldsToRequest}
      }`
  } else {
    // Default to return all medicinal products
      return `{
          find(func: has(code) ) @recurse(depth: 9) @filter(eq(type,"medicinal_product"))
          ${fieldsToRequest}
      }`
    }
  }

/**
* 
* DGraphResponseMap maps from Dgraph response to V1 Universal Codes Schema
*
* @param {obj}     responseData - data returned from Dgraph
* @return {obj}    Returns JSON complying to V1 schema
* Sample Format: 
* {
*   code: 3692b4bf,
*   name: Amoxicillin (trihydrate) 500mg solid oral dosage form"
* },
* {
*   code: 367734bf,
*   name: Amoxicillin & clavulanic acid 125mg &31.25mg /5mL oral liquid"
* }
*/
export const DGraphResponseMap = (responseData) => {
  // Currently test data only
  return Object.entries(testData).map(([key, value]) => ({ code: key, name: value }));
}