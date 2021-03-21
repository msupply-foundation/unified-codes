export enum EPropertyType {
    RxNav = 'code_rxnav',
    WHOEML = 'who_eml',
    NZULM = 'code_nzulm',
    UNSPSC = 'code_unspsc',
};

export interface IPropertyNode {
    code: string;
    type?: string;
    value?: string;
};
    
export default IPropertyNode;