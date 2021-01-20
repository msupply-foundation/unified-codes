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
} from '@unified-codes/data/v1';

export type FilterMatch = 'begin' | 'contains' | 'exact' | undefined;

@ObjectType()
export class EntityType implements IEntity {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [EntityType], { nullable: true })
  children: IEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  @Field((type) => String, { nullable: true })
  type: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  value: string;
}

@ObjectType()
export class DrugInteractionsType implements IDrugInteractions {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [DrugInteractionType])
  data: IDrugInteraction[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [GraphQLErrorType])
  errors: GraphQLError[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  message: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locations: any[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [String], { nullable: true })
  path: (string | number)[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  nodes: ASTNode[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => SourceType, { nullable: true })
  source: Source;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [Int], { nullable: true })
  positions: number[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => ErrorType, { nullable: true })
  originalError: Error;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String, { nullable: true })
  stack: string;
}

@ObjectType()
class SourceType implements Source {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  body: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => LocationType)
  locationOffset: SourceLocation;
}

@ObjectType()
class LocationType implements SourceLocation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  line: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  column: number;
}

@ObjectType()
class ErrorType implements Error {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  message: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => String)
  stack?: string;
}
