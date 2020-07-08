const PARAMETERS = {
  '/items': ['code', 'name', 'exact'],
};

const parseBool = val => {
  const truthyValues = [ 'true', true ];
  return truthyValues.includes(val);
}

/**
 * Parse query parameters.
 *
 * @param  {Object}        params    Request query parameters.
 * @param  {Array<String>} whiteList Valid parameters per implementation.
 * @return {Object}                  Object containing valid and invalid parameters.
 */
export const parseRequest = (request) => {
  const { url } = request.raw;
  const [baseUrl] = url.split('?');
  const whitelist = PARAMETERS[baseUrl];
  const { query } = request;

  return {
    parameters: {
      valid: Object.keys(query).filter((param) => whitelist.includes(param)),
      invalid: Object.keys(query).filter((param) => !whitelist.includes(param)),
    },
  };
};

/**
 * Map API request to GraphQL+- payload. Query parameters are assumed valid.
 *
 * @param  {Object} request REST api request.
 * @return {String}         GraphQL+- request payload for Dgraph server.
 */
export const mapRequest = (request) => {
  const { query } = request;
  const { code, name } = query;
  const exact = parseBool(query.exact);

  if (code) {
    return `{
      query(func: has(code)) @filter(eq(code, ${code}))
      {	
        code
        description
      }
    }`;
  } else if (name) {
    if (exact) {
      return `{
        query(func: has(code)) @filter(eq(description, ${name}) AND eq(type, "unit_of_use")) {
          code
          description
        }
      }`;
    } else {
      return `{
        query(func: has(code)) @filter(regexp(description, "^${name}.*$", "i") AND eq(type, "unit_of_use")) {
          code
          description
        }
      }`;
    }
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
