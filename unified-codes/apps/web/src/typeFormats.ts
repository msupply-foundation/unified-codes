import { EEntityType } from '@unified-codes/data/v1';

const typeFormats: { [type: string]: string } = {
    [EEntityType.FORM_CATEGORY]: 'Routes',
    [EEntityType.FORM]: 'Forms',
    [EEntityType.FORM_QUALIFIER]: 'Forms (qualifiers)',
    [EEntityType.STRENGTH]: 'Strengths',
    [EEntityType.UNIT_OF_USE]: 'Units',
}

export const typeFormatter = (type: string) => {
    const typeFormatted = typeFormats[type];
    return typeFormatted ?? type;
};
