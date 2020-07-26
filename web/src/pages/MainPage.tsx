import * as React from "react";
import { useQuery, gql } from '@apollo/client';

import {Container, EntityBrowser } from '../components';
import { Entity, EntityNode } from "../types";

const query = gql`
    query allEntities {
        entities {
            code,
            description,
            type
        }
    }
`;

export const MainPage = () => {  
    const { loading, error, data } = useQuery(query);

    if (loading) return <Container>Loading...</Container>;
    if (error) return <Container>Error :(</Container>;
    if (data) {
        const entities = data.entities.map((entityNode: EntityNode) => new Entity(entityNode));
        return <EntityBrowser entities={entities}/>;
    } 

    return null;
};

export default MainPage;