import * as React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { EntityNode, Entity } from "../src/types";
import { Alert, AlertProps, EntityBrowser, Snackbar } from "../src/components";

export default { title: "EntityBrowser" };

export const withMockData = () => {
  const data: EntityNode[] = [
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
  ];
  const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
  return <EntityBrowser entities={entities} />;
};

export const withApolloData = () => {
  type UserAlert = {
    severity: AlertProps["Color"];
    show: boolean;
    text: string;
  };
  const defaultAlert: UserAlert = { show: false, text: "", severity: "info" };
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  const query = gql`
    query allEntities {
      entities {
        code
        description
        type
      }
    }
  `;

  const hideAlert = () => {
    setAlert(defaultAlert);
  };

  const showAlert = (text: string, severity: AlertProps["Color"]) => {
    const newAlert: UserAlert = { show: true, text, severity };
    setAlert(newAlert);
  };

  const [data, setData] = React.useState([]);
  const [alert, setAlert] = React.useState(defaultAlert);

  if (data.length) {
    const entities = data.map(
      (entityNode: EntityNode) => new Entity(entityNode)
    );
    return <EntityBrowser entities={entities} />;
  } else {
    if (!alert.show) {
      showAlert("Fetching...", "info");
      client
        .query({ query })
        .then((response) => {
          setData(response?.data?.entities ?? []);
        })
        .catch((error) => {
          showAlert(error.message, "error");
        });
    }
    return (
      <Snackbar open={alert.show} autoHideDuration={6000} onClose={hideAlert}>
        <Alert onClose={hideAlert} severity={alert.severity}>
          {alert.text}
        </Alert>
      </Snackbar>
    );
  }
};
