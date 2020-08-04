const items: { [key: string]: string } = {
  get: `query vars($code: string) {
    query (func: eq(code, $code)) {	
      code
      description
    }
  }`,
  search: `query vars($term: string) {
    query(func: regexp(description, $term)) @filter(eq(type, "unit_of_use")) {
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
    query(func: has(code)) @filter(eq(type,"unit_of_use")) {
      code
      description
    }
  }`,
};

export { items };

export default { items };
