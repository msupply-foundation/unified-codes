const PARAMETERS = {
  '/items': ['code', 'exact', 'fields', 'fuzzy', 'inclusive', 'name', 'search'],
};

/**
 * Parse query parameters.
 *
 * @param  {Object}        params    Request query parameters.
 * @param  {Array<String>} whiteList Valid parameters per implementation.
 * @return {Object}                  Object containing valid and invalid parameters.
 */
export const parseRequest = (request) => {
  const { url } = request;
  const whitelist = PARAMETERS[url];
  const { params } = request;
  return Object.keys(params).reduce(
    ({ parameters }, param) => {
      const { valid: validParameters, invalid: invalidParameters } = parameters;
      if (whitelist.includes(param))
        return { parameters: { valid: { ...validParameters, param }, invalid: invalidParameters } };
      return { parameters: { valid: validParameters, invalid: { ...invalidParameters, param } } };
    },
    { parameters: { valid: [], invalid: [] } }
  );
};

/**
 * Map API request to GraphQL+- payload. Query parameters are assumed valid.
 *
 * @param  {Object} request REST api request.
 * @return {String}         GraphQL+- response from Dgraph server.
 */
export const mapRequest = (request) => {
  const { query } = request;
  const { code, search } = query;

  if (code) {
    return `{
      query(func: has(code)) @filter(eq(code, ${code}))
      {	
        code
        description
      }
    }`;
  } else if (search) {
    return `{
      query(func: has(code)) @filter(allofterms(description, "${search}")) {
        code
        description
      }
    }`;
  } else {
    // Default to all unit of use entities
    return `{
      query(func: has(code)) @filter(eq(type,"unit_of_use")) {
        code
        description
      }
    }`;
  }
};

/**
 *
 * Map Dgraph response to valid v1 API JSON payload.
 *
 * @param  {Object} request  GraphQL+- request sent to Dgraph server.
 * @param  {Object} response GraphQL+- response received from Dgraph server.
 * @return {Object}          JSON object complying to v1 schema.
 *
 * Example response format:
 *
 * [
 *   {
 *     code: 3692b4bf,
 *     name: Amoxicillin (trihydrate) 500mg solid oral dosage form"
 *   },
 *   {
 *     code: 367734bf,
 *     name: Amoxicillin & clavulanic acid 125mg &31.25mg /5mL oral liquid"
 *   }
 * ]
 */
export const mapResponse = (response) => {
  const { data } = response;
  if (data.length - 1) {
    return JSON.stringify(
      data?.query.map(({ code, description }) => ({ code, name: description })) ?? []
    );
  } else {
    const [{ code, description }] = data?.query ?? [];
    return JSON.stringify({ code, name: description });
  }
};
