import * as React from "react";
import { EntityTableRow } from "../src/components";
import { Entity, EntityNode } from "../src/types";

const entities: { [key: string]: EntityNode } = {
  amoxicillin: {
    code: "QFWR9789",
    description: "Amoxicillin",
    type: "medicinal_product",
  },
  paracetamol: {
    code: "GH89P98W",
    description: "Paracetamol",
    type: "medicinal_product",
  },
};

export default { title: "EntityTableRow" };

export const withAmoxicillin = () => {
  const { amoxicillin } = entities;
  const entity = new Entity(amoxicillin);
  return <EntityTableRow entity={entity} />;
};

export const withParacetamol = () => {
  const { paracetamol } = entities;
  const entity = new Entity(paracetamol);
  return <EntityTableRow entity={entity} />;
};
