import IPropertyNode from './PropertyNode';

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
}

export interface IEntityNode {
  code: string;
  name?: string;
  type?: EEntityType;
  combines?: IPropertyNode[];
  properties?: IPropertyNode[];
  children?: IEntityNode[];
  value?: string;
};
  
export default IEntityNode;