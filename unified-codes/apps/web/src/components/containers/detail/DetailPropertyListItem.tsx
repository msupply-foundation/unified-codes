import * as React from 'react';

import { IEntity, IProperty } from '@unified-codes/data/v1';

import { ListItem, LinkIcon, ListItemText, ListItemIcon, Link } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';
import { PROPERTY_LABEL, PROPERTY_URL } from 'apps/web/src/types';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    icon: {
      verticalAlign: 'bottom',
      marginLeft: '4px',
      marginRight: '8px',
    },
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
    },
    link: {
      color: theme.palette.action.active,
      textDecoration: 'none',
      marginTop: '-5px',
      marginBottom: '0px',
    },
    textItem: {
      margin: '1px 0px 1px 0px',
    }
  })
);

interface DetailPropertyListItemProps {
  parent: IEntity,
  property: IProperty,
}

export type DetailPropertyListItem = React.FunctionComponent<DetailPropertyListItemProps>;

const DetailPropertyListItem: DetailPropertyListItem = ({
  parent,
  property,
}) => {
  const classes = useStyles();

  const { description } = parent;
  const { type, value } = property;

  const label = PROPERTY_LABEL[type];
  const url = PROPERTY_URL[type] ? PROPERTY_URL[type](value) : '';

  const primary = `${description} - ${label}`
  const secondary = url ? <Link className={classes.link} href={url} target="_blank">{value}<LinkIcon className={classes.icon}/></Link> : value;

  return <ListItem className={classes.item}><ListItemIcon/><ListItemText className={classes.textItem} primary={primary} secondary={secondary}/></ListItem>
};

export default DetailPropertyListItem;
