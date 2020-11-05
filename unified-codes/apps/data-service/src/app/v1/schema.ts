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
  @Field((type) => [EntityType], { nullable: true })
  children: IEntity[];

  @Field((type) => String)
  code: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => [DrugInteractionType], { nullable: true })
  interactions: IDrugInteraction[];

  @Field((type) => [PropertyType], { nullable: true })
  properties: IProperty[];

  @Field((type) => String)
  type: string;

  @Field((type) => ID)
  uid: string;
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

  @Field((type) => Boolean, {
    nullable: true,
    defaultValue: true,
  })
  sortAscending: boolean;

  @Field((type) => String, {
    nullable: true,
    defaultValue: 'description',
  })
  sortBy: string;

  @Field((type) => String, { nullable: true })
  type: string;
}

@InputType()
export class EntitySortInput implements Omit<IEntitySort, 'field'> {

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
