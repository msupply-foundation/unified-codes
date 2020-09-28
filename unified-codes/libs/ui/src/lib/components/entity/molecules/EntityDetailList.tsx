import * as React from 'react';

import { Property, IEntity } from '@unified-codes/data';
import { Typography } from '../../data';
import { Grid } from '../../layout';
import { Link } from '../../navigation';
import { EntityDetailListItem } from './EntityDetailListItem';
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
  const headerTypography = headerVariant ?? 'h6';

  return (
    <Grid container direction="column">
      <Typography variant={headerTypography}>Forms</Typography>
      <ul>
        {productSubCategories?.map((category) => {
          return <EntityDetailListItem entity={category} />;
        })}
      </ul>
      <Typography variant={headerTypography}>Properties</Typography>
      <ul>
        {entityProperties?.map((item) => (
          <li key={item.type}>
            {item.type}: {item.value}
          </li>
        ))}
      </ul>
      <Typography variant={headerTypography}>External Links</Typography>
      <ul>
        {externalLinks?.map((item) => (
          <li key={item.type}>
            <Link href={item.url}>{item.type}</Link>
          </li>
        ))}
      </ul>
    </Grid>
  );
};

export default EntityDetailList;
