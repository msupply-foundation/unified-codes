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

  const EntityListItemText = () => <ListItemText primary={description} />;
  const EntityListToggleIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;
  const EntityListToggleItem = () => {
    if (!childEntities?.length) return <EntityListItemText />;
    return (
      <ListItem button onClick={onToggle}>
        <EntityListItemText />
        <ListItemIcon>
          <EntityListToggleIcon />
        </ListItemIcon>
      </ListItem>
    );
  };

  const EntityListChildItems = React.useCallback(() => {
    if (!childEntities?.length) return null;
    return (
      <Collapse in={isOpen}>
        <List>
          {childEntities?.map((child: IEntity) => (
            <DetailEntityListItem description={child.description} childEntities={child.children} />
          ))}
        </List>
      </Collapse>
    );
  }, [isOpen, childEntities]);

  return (
    <ListItem>
      <List className={classes.root}>
        <EntityListToggleItem />
        <EntityListChildItems />
      </List>
    </ListItem>
  );
};

export default DetailEntityListItem;
