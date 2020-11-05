import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';

import {
  IEntity,
  IEntitySort,
  IDrugInteraction,
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