import { ASTNode, GraphQLError, Source, SourceLocation } from 'graphql';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';

import {
  IEntity,
  IEntitySort,
  IDrugInteraction,
  IDrugInteractions,
  IProperty,
  IEntityCollection,
  IEntitySearch,
} from './types';

export type FilterMatch = 'begin' | 'contains' | 'exact' | undefined;

@ObjectType()
export class EntityType implements IEntity {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [EntityType], { nullable: true })
  children: IEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  code: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [DrugInteractionType], { nullable: true })
  interactions: IDrugInteraction[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  type: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => ID)
  uid: string;

  @Field((type) => EntityType, { nullable: true })
  product: IEntity;
}

@ObjectType()
export class EntityCollectionType implements IEntityCollection {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [EntityType])
  data: IEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  totalLength: number;
}

@InputType()
export class EntitySearchInput implements Omit<IEntitySearch, 'type'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  code: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => EntitySortInput, { nullable: true })
  orderBy: IEntitySort;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  type: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  match: FilterMatch;
}

@InputType()
export class EntitySortInput implements Omit<IEntitySort, 'field'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Boolean, {
    nullable: true,
    description: 'Defaults to ascending search if not specified',
  })
  descending: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, {
    nullable: true,
    description: 'Defaults to search on description if not specified',
  })
  field: string;
}

@ObjectType()
export class PropertyType implements IProperty {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  type: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  value: string;
}

@ObjectType()
export class DrugInteractionsType implements IDrugInteractions {
  @Field((type) => [DrugInteractionType])
  data: IDrugInteraction[];

  @Field((type) => [GraphQLErrorType])
  errors: GraphQLError[];

  @Field((type) => String)
  rxcui: string;
}

@ObjectType()
export class DrugInteractionType implements IDrugInteraction {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  rxcui: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  severity: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  source: string;
}

@ObjectType()
export class GraphQLErrorType {
  @Field((type) => String)
  message: string;

  @Field((type) => String, { nullable: true })
  locations: any[];

  @Field((type) => [String], { nullable: true })
  path: (string | number)[];

  @Field((type) => String, { nullable: true })
  nodes: ASTNode[];

  @Field((type) => SourceType, { nullable: true })
  source: Source;

  @Field((type) => [Int], { nullable: true })
  positions: number[];

  @Field((type) => ErrorType, { nullable: true })
  originalError: Error;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  stack: string;
}

@ObjectType()
class SourceType implements Source {
  @Field((type) => String)
  body: string;

  @Field((type) => String)
  name: string;

  @Field((type) => LocationType)
  locationOffset: SourceLocation;
}

@ObjectType()
class LocationType implements SourceLocation {
  @Field((type) => Int)
  line: number;

  @Field((type) => Int)
  column: number;
}

@ObjectType()
class ErrorType implements Error {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  message: string;

  @Field((type) => String)
  stack?: string;
}
