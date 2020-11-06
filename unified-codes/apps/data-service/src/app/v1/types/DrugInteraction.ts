export interface IDrugInteraction {
    name: string;
    description: string;
    severity: string;
    source: string;
    rxcui: string;
  }
  
  export class DrugInteraction implements IDrugInteraction {
    readonly name: string;
    readonly description: string;
    readonly severity: string;
    readonly source: string;
    readonly rxcui: string;
  
    constructor(interaction: IDrugInteraction) {
      this.name = interaction.name;
      this.description = interaction.description;
      this.severity = interaction.severity;
      this.source = interaction.source;
      this.rxcui = interaction.rxcui;
    }
  }
  
  export default DrugInteraction;