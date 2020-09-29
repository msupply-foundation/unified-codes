import * as React from 'react';

import { Property, IEntity } from '@unified-codes/data';
import { Typography } from '../../data';
import { Grid } from '../../layout';
import { Link } from '../../navigation';
import { EntityDetailCategory } from './EntityDetailCategory';
import { TypographyVariant } from '@material-ui/core';

export interface IExternalLink {
  type: string;
  url: string;
}

export interface EntityDetailListProps {
  headerVariant?: TypographyVariant;
  productSubCategories?: IEntity[];
  entityProperties?: Property[];
  externalLinks?: IExternalLink[];
}

export type EntityDetailList = React.FunctionComponent<EntityDetailListProps>;

export const EntityDetailList: EntityDetailList = ({
  headerVariant,
  productSubCategories,
  externalLinks,
  entityProperties,
}) => {
  const headerTypography: TypographyVariant = headerVariant ?? 'h6';
  const noResults: JSX.Element = <li>None</li>;

  return (
    <Grid container direction="column">
      <Typography variant={headerTypography}>Forms</Typography>
      <ul>
        {productSubCategories?.length
          ? productSubCategories.map((category) => (
              <EntityDetailCategory entity={category} key={category.description} />
            ))
          : noResults}
      </ul>
      <Typography variant={headerTypography}>Properties</Typography>
      <ul>
        {entityProperties?.length
          ? entityProperties.map((item) => (
              <li key={item.type}>
                {item.type}: {item.value}
              </li>
            ))
          : noResults}
      </ul>
      <Typography variant={headerTypography}>External Links</Typography>
      <ul>
        {externalLinks?.length
          ? externalLinks.map((item) => (
              <li key={item.type}>
                <Link href={item.url}>{item.type}</Link>
              </li>
            ))
          : noResults}
      </ul>
    </Grid>
  );
};

export default EntityDetailList;
