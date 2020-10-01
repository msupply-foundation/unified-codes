export const mutations = {
  deleteEntity: (code: string) => {
    return `upsert {
      query {
        var(func: eq(code, ${code}), first: 1) @recurse(loop:false) {
          Entity as uid
          Child as has_child
          Property as has_property
        }
      }
      mutation {
        delete {
         uid(Entity) <code> * .
         uid(Entity) <description> * .
         uid(Entity) <type> * .
         uid(Entity) <has_child> * .
         uid(Entity) <has_property> * .
         uid(Entity) * * .
         uid(Child) <code> * .
         uid(Child) <description> * .
         uid(Child) <type> * .
         uid(Child) <has_child> * .
         uid(Child) <has_property> * .
         uid(Child) * * .
         uid(Property) <value> * .
         uid(Property) <type> * .
         uid(Property) <has_property> * .
         uid(Property) * * .
        }
      }
    }`;
  }
}

export default { mutations };