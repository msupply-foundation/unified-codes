const items = {
  get: `{
    query(func: has(code)) @filter(eq(code, $code)) {	
      code
      description
    }
  }`,
  search: `{
    query(func: has(code)) @filter(allofterms(description, "$search")) {
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
