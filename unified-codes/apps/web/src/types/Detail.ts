import { EEntityType, EPropertyType } from "@unified-codes/data/v1";

export const PROPERTY_LABEL = {
    [EPropertyType.RX_NAV]: 'RxNav RXCUI',
    [EPropertyType.NZULM]: 'NZULM ID',
    [EPropertyType.WHO_EML]: 'WHO EML Categories',
    [EPropertyType.UNSPSC]: 'UNSPSC Code',
};

export const PROPERTY_URL = {
    [EPropertyType.RX_NAV]: (code: string) =>
        `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${code}`,
    [EPropertyType.NZULM]: (code: string) => 
        `https://search.nzulm.org.nz/search/product?table=MP&id=${code}`,
}

export const ENTITY_TYPE_LABEL = {
    [EEntityType.FORM_CATEGORY]: 'Routes',
    [EEntityType.FORM]: 'Forms',
    [EEntityType.FORM_QUALIFIER]: 'Forms (qualifiers)',
    [EEntityType.STRENGTH]: 'Strengths',
    [EEntityType.UNIT_OF_USE]: 'Units',
    [EEntityType.PACK_IMMEDIATE]: 'Immediate Packaging',
}
