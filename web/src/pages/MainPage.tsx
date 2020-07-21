import * as React from "react";
import { Entity } from '../types';
import { EntityTable } from '../components/organisms';

const entities: Entity[] = [
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

export const MainPage = () => <div><EntityTable entities={entities}/></div>;

export default MainPage;