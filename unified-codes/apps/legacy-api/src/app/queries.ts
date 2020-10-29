const itemQueries: { [key: string]: string } = {
  get: `query vars($code: string) {
    query (func: eq(code, $code)) {	
      code
      description
    }
  }`,
  search: `query vars($term: string) {
    query(func: eq(type, "unit_of_use")) @filter(regexp(description, $term)) {
      code
      description
    }
  }`,
  searchExact: `query vars($name: string) {
    query(func: eq(description, $name)) @filter(eq(type, "unit_of_use")) {
      code
      description
    }
  }`,
  all: `{
    query(func: eq(type,"unit_of_use")) @filter(has(code)) {
      code
      description
    }
  }`,
};

export { itemQueries };

export default { itemQueries };
