const propertyFormats = [
  {
    type: 'code_rxnav',
    title: 'RxNav RXCUI',
    urlFormatter: (code: string) =>
      `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${code}`,
  },
  {
    type: 'code_nzulm',
    title: 'NZULM ID',
    urlFormatter: (code: string) =>
      `https://search.nzulm.org.nz/search/product?table=MP&id=${code}`,
  },
  {
    type: 'code_eml',
    title: 'WHO EML Categories',
  },
  {
    type: 'code_unspsc',
    title: 'UNSPSC Code',
  },
];

export const propertyFormatter = (type?: string, value?: string) => {
  const format = propertyFormats.find((pf) => pf.type === type);
  if (!format) return { title: type };

  const { title, urlFormatter } = format;
  const url = urlFormatter && value ? urlFormatter(value) : undefined;

  return {
    title,
    url,
  };
};
