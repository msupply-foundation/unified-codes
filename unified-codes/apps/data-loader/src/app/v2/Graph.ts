export interface INode {
  code: string;
  name?: string;
  type?: string;
  combines?: INode[];
  properties?: INode[];
  children?: INode[];
  value?: string;
};
  
export type IGraph = { [code: string]: INode };