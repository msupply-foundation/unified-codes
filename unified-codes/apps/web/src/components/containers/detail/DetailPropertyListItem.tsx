import * as React from 'react';

import { IProperty } from '@unified-codes/data/v1';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@unified-codes/ui/components';
import { useToggle } from '@unified-codes/ui/hooks';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

interface DetailPropertyListItemProps {
  description?: string;
  properties?: IProperty[];
}

export type DetailPropertyListItem = React.FunctionComponent<DetailPropertyListItemProps>;

const DetailPropertyListItem: DetailPropertyListItem = ({ description, properties }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const { length: childCount } = properties ?? [];

  const PropertyListToggleItemText = () => {
    const itemText = !!childCount ? `${description} (${childCount})` : description;
    return <ListItemText primary={itemText} />;
  };

  const PropertyListToggleItemIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  const PropertyListToggleItem = () =>
    !!childCount ? (
      <ListItem button onClick={onToggle}>
        <PropertyListToggleItemText />
        <ListItemIcon>
          <PropertyListToggleItemIcon />
        </ListItemIcon>
      </ListItem>
    ) : (
      <ListItem>
        <PropertyListToggleItemText />
      </ListItem>
    );

  const PropertyListChildItems = React.useCallback(() => {
    if (!childCount) return null;
    const childProperties = properties?.map((property: IProperty) => {
      const { type, value, properties } = property;
      const description = `${type}: ${value}`;
      return <DetailPropertyListItem key={type} description={description} properties={properties} />;
    });
    return <List>{childProperties}</List>;
  }, [properties]);

  return (
    <ListItem>
      <List className={classes.root}>
        <PropertyListToggleItem />
        <Collapse in={isOpen}>
          <PropertyListChildItems />
        </Collapse>
      </List>
    </ListItem>
  );
};

export default DetailPropertyListItem;
