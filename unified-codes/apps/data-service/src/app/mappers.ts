import { IDrugInteraction } from '@unified-codes/data';

export const mappers = {
  mapInteractionResponse: (response: any): IDrugInteraction[] => {
    const interactions: IDrugInteraction[] = [];
    response.interactionTypeGroup.map((interactionTypeGroup) => {
      interactionTypeGroup.interactionType.map((interactionType) => {
        interactionType.interactionPair.map((interactionPair) => {
          const interaction: IDrugInteraction = {
            source: interactionTypeGroup.sourceName,
            name: interactionPair.interactionConcept[1].sourceConceptItem.name,
            rxcui: interactionPair.interactionConcept[1].minConceptItem.rxcui,
            description: interactionPair.description,
            severity: interactionPair.severity,
          };
          interactions.push(interaction);
        });
      });
    });

    return interactions;
  },
};

export default { mappers };
