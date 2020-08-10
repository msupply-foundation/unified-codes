import { Property } from "./Property";

export type EntityNode = {
    code: string;
    description: string;
    type: string;
    properties?: Property[];
};