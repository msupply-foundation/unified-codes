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
  LinkIcon,
} from '@unified-codes/ui/components';
import { useToggle } from '@unified-codes/ui/hooks';
import { propertyFormatter } from '../../../propertyFormats';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
    listItemRoot: { paddingBottom: 0, paddingTop: 0}
  })
);

interface DetailPropertyListItemProps {
  properties?: IProperty[];
  type?: string;
  value?: string;
}

const formatProperty = (type?: string, value?: string) => {
  const formatted = propertyFormatter(type, value);
  const { title, url } = formatted;

  
    return (<div>
        <b>{title}</b><div>{value} {url && <a href={url} target="_blank"><LinkIcon /></a>}</div>
    </div>);
}

export type DetailPropertyListItem = React.FunctionComponent<DetailPropertyListItemProps>;

const DetailPropertyListItem: DetailPropertyListItem = ({ properties, type, value }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const { length: childCount } = properties ?? [];

  const PropertyListToggleItemText = () => {
    if (!!childCount) {
      return <ListItemText primary={`${value} (${childCount})`} />;
    }
    
    return <ListItemText primary={formatProperty(type, value)} />;
  };

  const PropertyListToggleItemIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  const PropertyListToggleItem = () =>
    !!childCount ? (
      <ListItem button onClick={onToggle} >
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
      
      return <DetailPropertyListItem key={type} type={type} value={value} properties={properties} />;
    });
    return <List>{childProperties}</List>;
  }, [properties]);

  return (
    <ListItem classes={{root: classes.listItemRoot}}> 
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
