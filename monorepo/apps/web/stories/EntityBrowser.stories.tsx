import * as React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { EntityNode, Entity } from "../src/types";
import { EntityBrowser } from "../src/components";

export default { title: 'EntityBrowser' };

export const withMockData = () => {  
    const data: EntityNode[] = [
        {
            "code": "QFWR9789",
            "description": "Amoxicillin",
            "type": "medicinal_product",
        },
        {
            "code": "GH89P98W",
            "description": "Paracetamol",
            "type": "medicinal_product",
        }
    ];
    const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
    return <EntityBrowser entities={entities}/>;
};

export const withApolloData = () => {
    const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        cache: new InMemoryCache(),
    });

    const query = gql`
        query allEntities {
            entities {
                code,
                description,
                type
            }
        }
    `;

    const [data, setData] = React.useState([]);

    if (data.length) {
        const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
        return <EntityBrowser entities={entities}/>;
    } else {
        client.query({ query }).then(response => {
            setData(response?.data?.entities ?? []);
        }).catch(error => console.log(error));
        return null;
    }
}