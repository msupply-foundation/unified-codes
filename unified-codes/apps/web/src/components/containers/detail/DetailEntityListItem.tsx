import * as React from 'react';

import { IEntity } from '@unified-codes/data';
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

interface DetailEntityListItemProps {
  description?: string;
  childEntities?: IEntity[];
}

export type DetailEntityListItem = React.FunctionComponent<DetailEntityListItemProps>;

const DetailEntityListItem: DetailEntityListItem = ({ description, childEntities }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const { length: childCount } = childEntities ?? [];

  const EntityListToggleItemText = () => {
    const itemText = !!childCount ? `${description} (${childCount})` : description;
    return <ListItemText primary={itemText} />;
  };

  const EntityListToggleItemIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  const EntityListToggleItem = () =>
    !!childCount ? (
      <ListItem button onClick={onToggle}>
        <EntityListToggleItemText />
        <ListItemIcon>
          <EntityListToggleItemIcon />
        </ListItemIcon>
      </ListItem>
    ) : (
      <ListItem>
        <EntityListToggleItemText />
      </ListItem>
    );

  const EntityListChildItems = React.useCallback(() => {
    if (!childCount) return null;
    const childItems = childEntities?.map((child: IEntity) => {
      const { description, children } = child;
      return <DetailEntityListItem description={description} childEntities={children} key={child.description} />;
    });
    return <List>{childItems}</List>;
  }, [childEntities]);

  return (
    <ListItem>
      <List className={classes.root}>
        <EntityListToggleItem />
        <Collapse in={isOpen}>
          <EntityListChildItems />
        </Collapse>
      </List>
    </ListItem>
  );
};

export default DetailEntityListItem;
