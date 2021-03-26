import * as React from 'react';

import { IEntity } from '@unified-codes/data/v1';
import { List, ListItem, ListItemText, Collapse, ListItemIcon, ArrowUpIcon, ArrowDownIcon } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityListItem from './DetailEntityListItem';

import { useToggle } from '@unified-codes/ui/hooks';

import { ITheme } from '../../../styles';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    icon: {
      marginRight: '8px',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 16px',
    },
    list: {
      margin: '0px 0px 0px 0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      width: '100%',
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


export interface DetailEntityListProps {
  description: string;
  entities: IEntity[];
}

export type DetailEntityList = React.FunctionComponent<DetailEntityListProps>;

export const DetailEntityListComponent: DetailEntityList = ({ description, entities }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const entityCount = entities.length;

  const EntityListToggleItemText = () => <ListItemText className={classes.textItem} primary={description} />;
  const EntityListToggleItemIcon = () => <IconButton className={classes.icon} onClick={(e) => { onToggle(); e.stopPropagation() }}>{ isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</IconButton>;

  const EntityListToggleItem = () =>
    !!entityCount ? (
      <ListItem className={classes.toggleItem} button onClick={onToggle}>
        <ListItemIcon>
          <EntityListToggleItemIcon />
        </ListItemIcon>
        <EntityListToggleItemText />
      </ListItem>
    ): null;

  const EntityListChildItems = React.useCallback(() => {
    const childItems = entities.map((entity: IEntity) => {
      return (
        <DetailEntityListItem
          entity={entity}
          key={entity.code}
        />
      );
    });
    return childItems;
  }, [entities]);

  return (
    <List className={classes.list}>
        <EntityListToggleItem />
        <Collapse in={isOpen}><List className={classes.list}><EntityListChildItems/></List></Collapse>
    </List>
  );
};

export const DetailEntityList = DetailEntityListComponent;

export default DetailEntityList;
