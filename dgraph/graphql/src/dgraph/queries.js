export const queries = {
  entities: (filter) => {
    const type = filter?.type ?? "medicinal_product";
    const codeFilter = filter?.code ? `@filter(eq(code, "${filter.code}"))` : ``;

    return `{
      query(func: eq(type, ${type})) ${codeFilter} @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`
  }
}

export default { queries };