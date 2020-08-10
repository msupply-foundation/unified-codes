import * as React from "react";
import { useQuery, gql } from "@apollo/client";

import { Grid } from "@unified-codes/ui";
import { EntityBrowser } from "@unified-codes/feature";
import { Entity, EntityNode } from "@unified-codes/data";

const mockData: { entities: EntityNode[] } = {
  entities: [
    {
      code: "QFWR9789",
      description: "Amoxicillin",
      type: "medicinal_product",
    },
    {
      code: "GH89P98W",
      description: "Paracetamol",
      type: "medicinal_product",
    },
  ],
};

const query = gql`
  query allEntities {
    entities {
      code
      description
      type
    }
  }
`;

export const Explorer = () => {
  const [entities, setEntities] = React.useState([]);
  const { loading, error, data } = useQuery(query);

  if (entities.length) {
    return (
      <Grid container justify="center">
        <EntityBrowser entities={entities} />
      </Grid>
    );
  }

  if (loading) {
    return (
      <Grid container justify="center">
        Loading...
      </Grid>
    );
  }

  if (data || error) {
    const entityData = data ?? mockData;
    const entities = entityData.entities.map(
      (entityNode: EntityNode) => new Entity(entityNode)
    );
    setEntities(entities);
  }

  return null;
};

export default Explorer;
