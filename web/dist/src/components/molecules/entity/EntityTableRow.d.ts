import * as React from "react";
import { Entity } from "../../../types";
export interface EntityTableRowProps {
  entity: Entity;
}
export declare type EntityTableRow = React.FunctionComponent<
  EntityTableRowProps
>;
export declare const EntityTableRow: EntityTableRow;
