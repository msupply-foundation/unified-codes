const items = {
  get: `query vars($code: string) {
    query (func: has(code)) @filter(eq(code, $code)) {	
      code
      description
    }
  }`,
  search: `query vars($term: string) {
    query(func: has(code)) @filter(regexp(description, $term) AND eq(type, "unit_of_use")) {
      code
      description
    }
  }`,
  searchExact: `query vars($name: string) {
    query(func: has(code)) @filter(eq(description, $name) AND eq(type, "unit_of_use")) {
      code
      description
    }
  }`,
  all: `{
    query(func: has(code)) @filter(eq(type,"unit_of_use")) {
      code
      description
    }
  }`,
};

export { items };

export default { items };
