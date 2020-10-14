import { registerEnumType, ObjectType, InputType, Field, Int } from "type-graphql";

import { IEntity, IEntitySort, IDrugInteraction, IProperty, IEntityCollection, IEntitySearch, EEntityField, EEntityType } from '@unified-codes/data';

// registerEnumType(EEntityType, {
//   name: "EEntityType",
// });

// registerEnumType(EEntityField, {
//   name: "EEntityField",
// });

@ObjectType()
export class EntityType implements IEntity {
  @Field()
  uid: string;

  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  type: string;

  @Field(type => DrugInteractionType, { nullable: true })
  interactions: IDrugInteraction[];

  @Field(type => [EntityType], { nullable: true })
  children: IEntity[];

  @Field(type => [PropertyType], { nullable: true })
  properties: IProperty[];
}

@ObjectType()
export class EntityCollectionType implements IEntityCollection {
  @Field(type => [EntityType])
  data: IEntity[];

  @Field(type => Int)
  totalLength: number;
}

@InputType()
export class EntitySearchInput implements Omit<IEntitySearch, 'type'> {
  @Field()
  code: string;

  @Field()
  description: string;

  @Field(type => EntitySortInput)
  orderBy: IEntitySort;

  @Field(type => String)
  type: string;
}

@InputType()
export class EntitySortInput implements Omit<IEntitySort, 'field'> {
  @Field(type => String)
  field: string;

  @Field()
  descending: boolean;
}

@ObjectType()
export class PropertyType implements IProperty {
  @Field()
  type: string;

  @Field()
  value: string;

  @Field(type => [PropertyType], { nullable: true })
  properties: IProperty[];
}

@ObjectType()
export class DrugInteractionType implements IDrugInteraction {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  severity: string;

  @Field()
  source: string;

  @Field()
  rxcui: string;
}
