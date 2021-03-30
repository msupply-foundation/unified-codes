import * as React from 'react';
import { connect } from 'react-redux';
import * as copy from 'clipboard-copy';

import { IEntity } from '@unified-codes/data/v1';

import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Collapse,
  ListItemIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FileCopyIcon,
} from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';
import { useToggle } from '@unified-codes/ui/hooks';

import DetailPropertyList from './DetailPropertyList';
import DetailEntityTypeList from './DetailEntityTypeList';

import { AlertActions, IAlertAction } from '../../../actions';
import { ITheme } from '../../../styles';
import { AlertSeverity, IState } from '../../../types';

// TODO: pass styles down to children!
const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    button: {
      marginRight: '8px',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    list: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    listItem: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 10px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    },
    listItemText: {
      margin: '1px 0px 1px 0px',
    },
    root: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    },
  })
);

interface DetailEntityListItemProps {
  parent: IEntity;
  entity: IEntity;
  onCopy: (code: string) => null;
}

export type DetailEntityListItem = React.FunctionComponent<DetailEntityListItemProps>;

const DetailEntityListItemComponent: DetailEntityListItem = ({ parent, entity, onCopy }) => {
  const classes = useStyles();

  const { isOpen, onToggle } = useToggle(false);

  const { code, description, children = [], properties = [] } = entity;

  const isRoot = parent === entity;

  const EntityListItemText = () => (
    <ListItemText className={classes.listItemText} primary={description} secondary={code} />

  if (!childCount)
    return (
      <ListItem className={classes.item}>
        <ListItemIcon />
        <ListItemText className={classes.textItem} primary={description} secondary={code} />
        <IconButton
          className={classes.copyButton}
          onClick={(e) => {
            onCopy(code);
            e.stopPropagation();
          }}
        >
          <FileCopyIcon />
        </IconButton>
      </ListItem>
  );

  const ChildListToggleItemText = () => (
    <ListItemText className={classes.textItem} primary={description} secondary={code} />
  );
  const ChildListToggleItemIcon = () => (
    <IconButton
      className={classes.icon}
      onClick={(e) => {
        onToggle();
        e.stopPropagation();
      }}
    >
      {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </IconButton>
  );

  const ChildListToggleItem = () => (
    <ListItem
      className={classes.toggleItem}
      button
      onClick={(e) => {
        onToggle();
        e.stopPropagation();
      }}
    >
      <ListItemIcon>
        <ChildListToggleItemIcon />
      </ListItemIcon>
      <ChildListToggleItemText />
      <IconButton
        className={classes.copyButton}
        onClick={(e) => {
          onCopy(code);
          e.stopPropagation();
        }}
      >
        <FileCopyIcon />
      </IconButton>
    </ListItem>
  );

  const PropertyList = () => {
    if (!propertyCount) return null;
    const description = `Properties (${propertyCount})`;
    return <DetailPropertyList description={description} parent={entity} properties={properties} />;
  };

  const ChildList = () => (
    <List className={classes.list}>
      <ListItem className={classes.item}>
        <DetailEntityTypeList parent={entity} entities={children} />
      </ListItem>
      <ListItem className={classes.item}>
        <PropertyList />
      </ListItem>
    </List>
  );

  return (
    <ListItem className={isRoot ? classes.rootItem : classes.item}>
      <List className={classes.list}>
        <ChildListToggleItem />
        <Collapse in={isOpen}>
          <ChildList />
        </Collapse>
      </List>
    </ListItem>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IAlertAction>) => {
  const onCopy = (code: string) => {
    copy(code);
    dispatch(
      AlertActions.raiseAlert({
        severity: AlertSeverity.Info,
        text: `Code ${code} copied to clipboard`,
        isVisible: true,
      })
    );
  };

  return { onCopy };
};

const mapStateToProps = (_: IState) => ({});

const DetailEntityListItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailEntityListItemComponent);

export default DetailEntityListItem;
