export const config = {
  properties: [
    {
      id: '5ef14d93-e9c7-4245-aa74-0a0068754613',
      type: 'code_rxnav',
      label: 'RxNav RXCUI',
      url: 'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm={{code}}',
    },
    {
      id: 'd435bb9f-8513-44b5-83e3-44ff4dd745db',
      type: 'code_nzulm',
      label: 'NZULM ID',
      url: 'https://search.nzulm.org.nz/search/product?table=MP&id={{code}}',
    },
    {
      id: '42c1f86b-ee95-469c-a1a1-905b9016913b',
      type: 'who_eml',
      label: 'WHO EML Categories',
      url: '',
    },
    {
      id: '8e34c0d7-bea7-4a59-9c45-ea4036b32041',
      type: 'code_unspsc',
      label: 'UNSPSC Code',
      url: '',
    },
  ],
  basicCategories: [
    {
      label: 'Haemodialysis Equipment and Products',
      value: 'Haemodialysis Equipment and Products',
      id: 'f85357e0-e9b6-4333-a1a9-ce443ef9ab1f',
    },
  ],
  intermediateCategories: [
    {
      label: 'Ancillary Devices and Products',
      value: 'Ancillary Devices and Products',
      id: 'ae05ff52-be4c-4f89-856a-3514af3f703d',
    },
  ],
  specificCategories: [
    {
      label: 'Ancillary Products',
      value: 'Ancillary Products',
      id: '248fb42e-2e11-4dcb-898f-5fafeb2cec8f',
    },
  ],
};
