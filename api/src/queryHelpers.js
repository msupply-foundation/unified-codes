/**
 * InvalidQueryParams checks for incorrect query parameter(s)
 *
 * @param {obj}     queryParams - object of request URL query params (AWS)
 * @param {arr}     whiteList - array of allowed params; per implementation
 * @return {arr}    returns array of bad parameters, or empty array
 */
export const FindInvalidQueryParams = (queryParams, whiteList) =>
  Object.keys(queryParams).filter((parameter) => !whiteList.includes(parameter));

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

  if (code) {
    return `{
      find(func: has(code)) @cascade
      {	
        description
        has_property @filter(eq(type,"form_category")){
          description
          has_child @filter(eq(type,"form")) {
            description 
            has_child @filter(eq(code,${code})) {
              code 
              value
            }
          }
        }
      }
    }`;
  } else if (search) {
    // Currently this will only match at product level node
    return `{
      find(func: eq(description, ${search})) 
      {	
        code
        description
        has_property @filter(eq(type,"form_category")){
          has_child @filter(eq(type,"form")) {
            description 
            has_child @filter(eq(type,"strength")) {
              code 
              value
            }
          }
        }
      }
    }`;
  } else {
    // Default to return all medicinal products that have codes
    return `{
      find(func: has(code)) @filter(eq(type,"medicinal_product")) 
      {
        {	
          code 
          description
          has_property @filter(eq(type,"form_category")){
            description
            has_child @filter(eq(type,"form")) {
              description 
              has_child @filter(eq(type,"strength")) {
                code 
                value
              }
            }
          }
        }
      }
    }`;
  }
};

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
export const DGraphResponseMap = (responseData) =>
{
  let resp  = []; 
  responseData?.find?.forEach((item) => {
    // Top Level (Medicinal Product)
    if (item.code){
      resp.push({ code: item.code, name: item.description});
    }
    
    // Second Level (Dose Forms)
    if (item.has_property)
    {
      const doseForms = item.has_property[0].has_child;
      for (let i = 0; i < doseForms.length; i++) {
        // Third Level (Unit of Use)
        const unitOfUse = item.has_property[0].has_child[i].has_child; 
        for (let j = 0; j < unitOfUse.length; j++) {
          resp.push({ 
            code: item.has_property[0].has_child[i].has_child[j].code,
            name: item.description.concat(' ', item.has_property[0].has_child[i].description, ' ', item.has_property[0].has_child[i].has_child[j].value)
          });
        }
      }
    }
  });
  return resp;
}