export enum EEntityType {
  Root = 'Root',
  Category = 'Category',
  Product = 'Product',
  Route = 'Route',
  Form = 'Form',
  FormQualifier = 'FormQualifier',
  DoseStrength = 'DoseStrength',
  Unit = 'Unit',
  PackImmediate = 'PackImmediate',
  PackSize = 'PackSize',
  PackOuter = 'PackOuter',
  Manufacturer = 'Manufacturer',
  Brand = 'Brand',
  Presentation = 'Presentation',
  ExtraDescription = 'ExtraDescription',
  ActiveIngredients = 'ActiveIngredients',
  VaccineNameDetails = 'VaccineNameDetails',
}

export enum EPropertyType {
  RxNav = 'code_rxnav',
  WHOEML = 'who_eml',
  NZULM = 'code_nzulm',
  NZULMItem = 'code_nzulm_item',
  UNSPSC = 'code_unspsc',
}

export interface IPropertyNode {
  type?: string;
  value?: string;
}

export interface IEntityNode {
  code: string;
  name?: string;
  description?: string;
  category?: string;
  type?: EEntityType;
  combines?: IEntityNode[];
  properties?: IPropertyNode[];
  children?: IEntityNode[];
  value?: string;
}

export default IEntityNode;
