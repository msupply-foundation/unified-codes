const parameterExtractorRE = /{{([^}]+)}}/g;

export type KeyedParams = {
  [id: string]: string;
};

type TeraParams = {
  [id: string]: string | TeraParams;
};

export const TeraUtils = {
  extractParams: function (templateText: string) {
    // Extracts parameters names from a template string
    // Example: extractParams('Hello {{name}}!') => ['name']
    return [...templateText.matchAll(parameterExtractorRE)].map(
      match => match[1]?.trim() ?? ''
    );
  },
  keyedParamsAsTeraJson: function (keyedParams: KeyedParams) {
    // Converts a keyed params object to a JSON string
    // Simple Example: keyedParamsAsJson({name: 'John'}) => '{"name": "John"}'
    // However if we have keys with `.` in them, we need to nest the keys.
    // Example: keyedParamsAsJson({'user.name': 'John', 'user.email': "john@example.com"}) => '{"user": {"name": "John", "john@example.com"}}'

    const mappedObject = TeraUtils.keyedParamsAsTeraParams(keyedParams);

    return JSON.stringify(mappedObject);
  },
  keyedParamsAsTeraParams: function (keyedParams: KeyedParams) {
    // Converts a KeyedParams object to a TeraParams Object
    // Simple Example: keyedParamsAsJson({name: 'John'}) => '{"name": "John"}'
    // However if we have keys with `.` in them, we need to nest the keys.
    // Example: keyedParamsAsTeraParams({'user.name': 'John', 'user.email': "john@example.com"}) => '{"user": {"name": "John", "email": "john@example.com"}}'

    let mappedObject = {} as TeraParams;
    for (const key of Object.keys(keyedParams)) {
      mappedObject = extractObj(mappedObject, key, keyedParams[key] ?? '');
    }

    return mappedObject;
  },
  keyedParamsFromTeraJson: function (teraJson: string) {
    // Converts a Tera JSON string to a keyed params object
    // Simple Example: keyedParamsFromJson('{"name": "John"}') => {name: 'John'}
    // If we have nested objects, their should be joined with a `.`
    // Example: keyedParamsFromJson('{"user": {"name": "John", "email": "john@example"}}') =>
    //   {'user.name': 'John', 'user.email': "john@example"}
    let keyedParams = {} as KeyedParams;
    try {
      const teraObject = JSON.parse(teraJson) as TeraParams;
      keyedParams = flattenTeraObject(teraObject);
    } catch (e) {
      console.log('parameter parsing error', e, teraJson);
    }
    return keyedParams;
  },
};

function flattenTeraObject(
  teraObject: TeraParams,
  prefix: string = ''
): KeyedParams {
  const keyedParams = {} as KeyedParams;
  for (const key of Object.keys(teraObject)) {
    const value = teraObject[key];
    if (!value) {
      keyedParams[`${prefix}${key}`] = '';
    } else if (typeof value === 'string') {
      keyedParams[`${prefix}${key}`] = value;
    } else {
      const nestedKeys = flattenTeraObject(value, `${prefix}${key}.`);
      for (const nestedKey of Object.keys(nestedKeys)) {
        const nestedValue = nestedKeys[nestedKey];
        keyedParams[`${nestedKey}`] = nestedValue ?? '';
      }
    }
  }
  return keyedParams;
}

function extractObj(
  currentObj: TeraParams | string | undefined,
  key: string,
  value: string
) {
  const keyParts = key.split('.');
  if (keyParts.length == 1) {
    // Base case, we have a single key return the value for it
    if (!currentObj || typeof currentObj !== 'object') {
      currentObj = {} as TeraParams;
    }
    currentObj[key] = value;
    return currentObj;
  }
  // Recursive case, we have a key with a dot in it, so we need to nest the keys
  const currentKey = keyParts[0] ?? '';
  const nextKey = keyParts.slice(1).join('.');

  // first check if we already have an object for this key
  let newObject = {} as TeraParams;
  if (currentObj && typeof currentObj === 'object') {
    newObject = currentObj;
  }

  // Now we need to recurse down the object
  newObject[currentKey] = extractObj(newObject[currentKey], nextKey, value);

  return newObject;
}
