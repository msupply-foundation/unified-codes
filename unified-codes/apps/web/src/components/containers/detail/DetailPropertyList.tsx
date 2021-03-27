import * as React from 'react';

import { IEntity, IProperty } from '@unified-codes/data/v1';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon,
} from '@unified-codes/ui/components';
import { useToggle } from '@unified-codes/ui/hooks';


import DetailPropertyListItem from './DetailPropertyListItem';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    list: {
      margin: '0px 0px 0px 0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      width: '100%',
    },
    icon: {
      marginRight: '8px',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 16px',
    },
    textItem: {
      margin: '1px 0px 1px 0px',
    },
    toggleItem: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 8px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    }
  })
);

interface DetailPropertyListProps {
  description?: string;
  parent: IEntity;
  properties?: IProperty[];
}

export type DetailPropertyList = React.FunctionComponent<DetailPropertyListProps>;

const DetailPropertyList: DetailPropertyList = ({ description, parent, properties }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const { length: childCount } = properties ?? [];

  const PropertyListToggleItemText = () => <ListItemText className={classes.textItem} primary={description} />;
  const PropertyListToggleItemIcon = () => <IconButton className={classes.icon} onClick={(e) => { onToggle(); e.stopPropagation() }}>{ isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</IconButton>;

  const PropertyListToggleItem = () =>
    !!childCount ? (
      <ListItem className={classes.toggleItem} button onClick={onToggle} >
        <ListItemIcon>
          <PropertyListToggleItemIcon />
        </ListItemIcon>
        <PropertyListToggleItemText />
      </ListItem>
    ) : null;

  const PropertyListChildItems = React.useCallback(() => {
    const childItems = properties?.map((property: IProperty) => {
      return <DetailPropertyListItem key={property.type} parent={parent} property={property} />;
    });
    return childItems;
  }, [properties]);

  return (
    <List className={classes.list}>
      <PropertyListToggleItem />
      <Collapse in={isOpen}>
        <List className={classes.list}><PropertyListChildItems /></List>
      </Collapse>
    </List>
  );
};

export default DetailPropertyList;
