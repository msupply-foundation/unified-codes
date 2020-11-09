import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';

import {
  IEntity,
  IEntitySort,
  IDrugInteractions,
  IProperty,
  IEntityCollection,
  IEntitySearch,
  IDrugInteraction,
} from '@unified-codes/data';
import { ASTNode, GraphQLError } from 'graphql';
import { Location as SourceLocation, Source } from 'graphql/language/source';

export type FilterMatch = 'begin' | 'contains' | 'exact' | undefined;

@ObjectType()
export class EntityType implements IEntity {
  @Field((type) => [EntityType], { nullable: true })
  children: IEntity[];

  @Field((type) => String)
  code: string;

  @Field((type) => String, { nullable: true })
  description: string;

  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];

  @Field((type) => String)
  type: string;

  @Field((type) => ID)
  uid: string;

  @Field((type) => EntityType, { nullable: true })
  product: IEntity;
}

@ObjectType()
export class EntityCollectionType implements IEntityCollection {
  @Field((type) => [EntityType])
  data: IEntity[];

  @Field((type) => Int)
  totalLength: number;
}

@InputType()
export class EntitySearchInput implements Omit<IEntitySearch, 'type'> {
  @Field((type) => String, { nullable: true })
  code: string;

  @Field((type) => String, { nullable: true })
  description: string;

  @Field((type) => EntitySortInput, { nullable: true })
  orderBy: IEntitySort;

  @Field((type) => String, { nullable: true })
  type: string;

  @Field((type) => String, { nullable: true })
  match: FilterMatch;
}

@InputType()
export class EntitySortInput implements Omit<IEntitySort, 'field'> {
  @Field((type) => Boolean, {
    nullable: true,
    description: 'Defaults to ascending search if not specified',
  })
  descending: boolean;

  @Field((type) => String, {
    nullable: true,
    description: 'Defaults to search on description if not specified',
  })
  field: string;
}

@ObjectType()
export class PropertyType implements IProperty {
  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];

  @Field((type) => String)
  type: string;

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
  @Field((type) => String)
  description: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  rxcui: string;

  @Field((type) => String)
  severity: string;

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
