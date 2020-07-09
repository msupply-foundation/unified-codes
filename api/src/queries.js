const items = {
  get: `query vars($code: string) {
    query (func: has(code)) @filter(eq(code, $code)) {	
      code
      description
    }
  }`,
  search: `query vars($name: string) {
    query(func: has(code)) @filter(eq(description, $name) AND eq(type, "unit_of_use")) {
      code
      description
    }
  }`,
  searchExact: `query vars($name: string) {
    query(func: has(code)) @filter(regexp(description, "^$name.*$", "i") AND eq(type, "unit_of_use")) {
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
