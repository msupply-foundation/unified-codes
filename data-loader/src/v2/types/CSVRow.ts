import ECSVColumn from './CSVColumn';

export interface IDrugCSVRow {
  [ECSVColumn.Product]: string;
  [ECSVColumn.ProductSynonym]: string;
  [ECSVColumn.Combination]: string;
  [ECSVColumn.Route]: string;
  [ECSVColumn.DoseForm]: string;
  [ECSVColumn.DoseQualification]: string;
  [ECSVColumn.Strength]: string;
  [ECSVColumn.UnitOfPresentation]: string;
  [ECSVColumn.ImmediatePackaging]: string;
  [ECSVColumn.PackSize]: string;
  [ECSVColumn.OuterPackaging]: string;
  [ECSVColumn.Manufacturer]: string;
  [ECSVColumn.Brand]: string;
  [ECSVColumn.UC1]: string;
  [ECSVColumn.UC2]: string;
  [ECSVColumn.UC3]: string;
  [ECSVColumn.UC4]: string;
  [ECSVColumn.UC5]: string;
  [ECSVColumn.UC6]: string;
  [ECSVColumn.UC7]: string;
  [ECSVColumn.UC8]: string;
  [ECSVColumn.UC9]: string;
  [ECSVColumn.UC10]: string;
  [ECSVColumn.UC11]: string;
  [ECSVColumn.UC12]: string;
  [ECSVColumn.RxNav]: string;
  [ECSVColumn.WHOEMLProduct]: string;
  [ECSVColumn.WHOEMLItem]: string;
  [ECSVColumn.NZULM]: string;
  [ECSVColumn.NZULMItem]: string;
  [ECSVColumn.UNSPSC]: string;
}

export interface IConsumableCSVRow {
  [ECSVColumn.DeviceName]: string;
  [ECSVColumn.Presentation]: string;
  [ECSVColumn.ExtraDescription]: string;
  [ECSVColumn.UC1]: string;
  [ECSVColumn.UC2]: string;
  [ECSVColumn.UC3]: string;
  [ECSVColumn.RxNav]: string;
  [ECSVColumn.WHOEMLProduct]: string;
  [ECSVColumn.WHOEMLItem]: string;
  [ECSVColumn.NZULM]: string;
  [ECSVColumn.NZULMItem]: string;
  [ECSVColumn.UNSPSC]: string;
}

export interface IVaccineCSVRow {
  [ECSVColumn.DrugName]: string;
  [ECSVColumn.DrugNameDetails]: string;
  [ECSVColumn.ActiveIngredients]: string;
  [ECSVColumn.Brand]: string;
  [ECSVColumn.Route]: string;
  [ECSVColumn.DoseForm]: string;
  [ECSVColumn.Strength]: string;
  [ECSVColumn.UnitOfPresentation]: string;
  [ECSVColumn.ImmediatePackaging]: string;
  [ECSVColumn.UC1]: string;
  [ECSVColumn.UC2]: string;
  [ECSVColumn.UC3]: string;
  [ECSVColumn.UC4]: string;
  [ECSVColumn.UC5]: string;
  [ECSVColumn.UC6]: string;
  [ECSVColumn.UC7]: string;
  [ECSVColumn.UC8]: string;
  [ECSVColumn.UC9]: string;
  [ECSVColumn.RxNav]: string;
  [ECSVColumn.WHOEMLProduct]: string;
  [ECSVColumn.WHOEMLItem]: string;
  [ECSVColumn.NZULM]: string;
  [ECSVColumn.NZULMItem]: string;
  [ECSVColumn.UNSPSC]: string;
}
