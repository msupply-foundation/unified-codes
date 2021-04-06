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
    copyButton: {
      marginRight: '8px',
    },
    icon: {
      marginRight: '8px',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 16px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    },
    list: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '&:hover': { backgroundColor: theme.palette.background.default },
    },
    rootItem: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 8px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    },
    textItem: {
      margin: '1px 0px 1px 0px',
    },
    toggleItem: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 8px',
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

  const childCount = children?.length ?? 0;
  const propertyCount = properties?.length ?? 0;

  const EntityListItemText = () => (
    <ListItemText className={classes.textItem} primary={description} secondary={code} />
  );

  const EntityListItemToggleButton = () => {
    const ToggleIcon = () => !!childCount || !!propertyCount ? (
      <IconButton
        className={classes.icon}
        onClick={(e) => {
          onToggle();
          e.stopPropagation();
        }}
      >
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </IconButton>
    ) : null;

    return (
      <ListItemIcon>
        <ToggleIcon/>
      </ListItemIcon>
    )
  }

  const EntityListItemCopyButton = () => (
    <IconButton
        className={classes.copyButton}
        onClick={(e) => {
          onCopy(code);
          e.stopPropagation();
        }}
      >
        <FileCopyIcon />
      </IconButton>
  )

  const EntityListItem = () => (
    <ListItem
      className={classes.toggleItem}
      button
      onClick={(e) => {
        onToggle();
        e.stopPropagation();
      }}
    >
      <EntityListItemToggleButton />
      <EntityListItemText />
      <EntityListItemCopyButton/>
    </ListItem>
  );

  const EntityChildList = () => {
    if (!childCount) return null;
    return <DetailEntityTypeList parent={entity} entities={children} />
  };

  const PropertyChildList = () => {
    if (!propertyCount) return null;
    const description = `Properties (${propertyCount})`;
    return <DetailPropertyList description={description} parent={entity} properties={properties} />;
  };

  return (
    <ListItem className={isRoot ? classes.rootItem : classes.item}>
      <List className={classes.list}>
        <EntityListItem />
        <Collapse in={isOpen}>
          <List className={classes.list}>
            <ListItem className={classes.item}>
              <EntityChildList/>
            </ListItem>
            <ListItem className={classes.item}>
              <PropertyChildList />
            </ListItem>
          </List>
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
