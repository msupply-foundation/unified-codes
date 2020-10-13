import * as React from 'react';

import { IProperty } from '@unified-codes/data';
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

  const Parent = () => {
    const ToggleIcon = () => {
      if (!properties?.length) return null;
      return isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    return (
      <ListItem button onClick={onToggle}>
        <ListItemText primary={description} />
        <ListItemIcon>
          <ToggleIcon />
        </ListItemIcon>
      </ListItem>
    );
  };

  const Children = React.useCallback(() => {
    const children = properties?.map((property: IProperty) => (
      <DetailPropertyListItem
        description={`${property.type}: ${property.value}`}
        children={property.properties}
      />
    ));

    return <List>{children}</List>;
  }, [properties]);

  return (
    <ListItem>
      <List className={classes.root}>
        <Parent />
        <Collapse in={isOpen}>
          <Children />
        </Collapse>
      </List>
    </ListItem>
  );
};

export default DetailPropertyListItem;
