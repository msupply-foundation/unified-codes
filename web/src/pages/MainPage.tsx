import * as React from "react";
import { useQuery, gql } from "@apollo/client";

import { Container, EntityBrowser, Grid } from "../components";
import { Entity, EntityNode } from "../types";

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
  ]
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

export const MainPage = () => {
  const [ entities, setEntities ] = React.useState([]);
  const { loading, error, data } = useQuery(query);

  if (entities.length) {
    return (
      <Container>
        <Grid container justify="center">
          <EntityBrowser entities={entities} />
        </Grid>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <Grid container justify="center">
          Loading...
        </Grid>
      </Container>
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

export default MainPage;
