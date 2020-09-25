import * as React from 'react';

import { Property } from '@unified-codes/data';
import { Grid } from '../../layout';
import { Paper } from '../../surfaces';
import { Typography } from '../../data';
import { Link } from '../../navigation/atoms';

export interface IFormCategory {
  name: string;
  forms?: string[];
}

export interface IExternalLink {
  type: string;
  url: string;
}

export interface EntityDetailsProps {
  formCategories?: IFormCategory[];
  entityProperties?: Property[];
  externalLinks?: IExternalLink[];
}

export type EntityDetails = React.FunctionComponent<EntityDetailsProps>;

export const EntityDetails: EntityDetails = ({
  formCategories,
  externalLinks,
  entityProperties,
}) => {
  return (
    <Paper>
      <Grid container direction="column">
        <Typography variant="h6">Forms</Typography>
        <ul>
          {formCategories?.map((item) => {
            return (
              <li key={item.name}>
                <Typography variant="body1">{item.name}</Typography>
                <ul>
                  {item.forms?.map((form) => {
                    return <li key={form}>{form}</li>;
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        <Typography variant="h6">Properties</Typography>
        <ul>
          {entityProperties?.map((item) => (
            <li key={item.type}>
              <Typography variant="body1">
                {item.type}: {item.value}
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="h6">External Links</Typography>
        <ul>
          {externalLinks?.map((item) => (
            <li key={item.type}>
              <Link href={item.url}>{item.type}</Link>
            </li>
          ))}
        </ul>
      </Grid>
    </Paper>
  );
};

export default EntityDetails;
