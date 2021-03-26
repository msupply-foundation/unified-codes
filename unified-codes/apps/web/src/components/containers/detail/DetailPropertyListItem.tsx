import * as React from 'react';

import { IProperty } from '@unified-codes/data/v1';
import { ListItem, LinkIcon, ListItemText, Link } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { propertyFormatter } from '../../../propertyFormats';

import { ITheme } from '../../../styles';
import { ListItemIcon } from '@material-ui/core';

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
  property: IProperty,
}

export type DetailPropertyListItem = React.FunctionComponent<DetailPropertyListItemProps>;

const DetailPropertyListItem: DetailPropertyListItem = ({
  property,
}) => {
  const classes = useStyles();

  const { type, value } = property;

  const formatted = propertyFormatter(type, value);
  const { title, url } = formatted;

  const link = url ? <Link className={classes.link} href={url} target="_blank">{value}<LinkIcon className={classes.icon}/></Link> : value;

  return <ListItem className={classes.item}><ListItemIcon/><ListItemText className={classes.textItem} primary={title} secondary={link}/></ListItem>
};

export default DetailPropertyListItem;
