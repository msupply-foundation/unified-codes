import { Field, ID, InputType, Int, ObjectType, registerEnumType } from 'type-graphql';

import {
  IEntity,
  IEntitySort,
  IDrugInteraction,
  IProperty,
  IEntityCollection,
  IEntitySearch,
  EEntityField,
  EEntityType,
} from '@unified-codes/data';

// registerEnumType(EEntityType, {
//   name: "EEntityType",
// });

// registerEnumType(EEntityField, {
//   name: "EEntityField",
// });

@ObjectType()
export class EntityType implements IEntity {
  @Field((type) => ID, { nullable: false })
  uid: string;

  @Field((type) => String, { nullable: false })
  code: string;

  @Field((type) => String, { nullable: false })
  name: string;

  @Field((type) => String, { nullable: false })
  type: string;

  @Field((type) => [EntityType], { nullable: true })
  children: IEntity[];

  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];
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