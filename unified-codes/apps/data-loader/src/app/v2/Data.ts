export interface IRow {
  product: string;
  product_synonym;
  combination: string;
  route: string;
  dose_form: string;
  dose_qualification: string;
  strength: string;
  unit_of_presentation: string;
  immediate_packaging: string;
  pack_size: string;
  outer_packaging: string;
  manufacturer: string;
  brand: string;
  uc1: string;
  uc2: string;
  uc3: string;
  uc4: string;
  uc5: string;
  uc6: string;
  uc7: string;
  uc8: string;
  uc9: string;
  uc10: string;
  uc11: string;
  uc12: string;
  rxnav: string;
  who_eml_product: string;
  who_eml_item: string;
  nzulm: string;
  nzulm_item: string;
  unspsc: string;
}
  
export type IData = IRow[];