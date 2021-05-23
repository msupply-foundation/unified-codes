import * as React from 'react';
import { connect } from 'react-redux';
import * as copy from 'clipboard-copy';

import { IEntity } from '@unified-codes/data/v1';

import {
  Collapse,
  CopyIconButton,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleIconButton,
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
    listItemTextChild: {
      margin: '1px 0px 1px 0px',
      fontWeight: 'bold',
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

  const { isOpen, onToggle } = useToggle(true);

  const { code, description, children = [], properties = [] } = entity;

  const isRoot = React.useMemo(() => parent === entity, [parent, entity]);
  const childCount = React.useMemo(() => children?.length ?? 0, [children]);
  const propertyCount = React.useMemo(() => properties?.length ?? 0, [properties]);

  const EntityListItemText = () => (
    <ListItemText
      classes={
        childCount
          ? { root: classes.listItemText }
          : { primary: classes.listItemTextChild, secondary: classes.listItemTextChild }
      }
      primary={description}
      secondary={code}
    />
  );

  const EntityListItemToggleButton = () => {
    const onClick = (e) => {
      onToggle();
      e.stopPropagation();
    };
    const ListButton = () =>
      !!childCount || !!propertyCount ? (
        <ToggleIconButton classes={{ root: classes.button }} isOpen={isOpen} onClick={onClick} />
      ) : (
        <IconButton />
      );

    return (
      <ListItemIcon>
        <ListButton />
      </ListItemIcon>
    );
  };

  const EntityListItemCopyButton = () => {
    const onClick = (e) => {
      onCopy(code);
      e.stopPropagation();
    };
    return <CopyIconButton classes={{ root: classes.button }} onClick={onClick} />;
  };

  const EntityListItem = () => (
    <ListItem className={classes.listItem}>
      <EntityListItemToggleButton />
      <EntityListItemText />
      <EntityListItemCopyButton />
    </ListItem>
  );

  const PropertyChildList = () => {
    if (!propertyCount) return null;
    const description = `Properties (${propertyCount})`;
    return <DetailPropertyList description={description} parent={entity} properties={properties} />;
  };

  const EntityChildList = () => {
    if (!childCount) return null;
    return <DetailEntityTypeList parent={entity} entities={children} />;
  };

  return (
    <ListItem className={isRoot ? classes.root : classes.listItem}>
      <List className={classes.list}>
        <EntityListItem />
        <Collapse in={isOpen}>
          <List className={classes.list}>
            <ListItem className={classes.listItem}>
              <EntityChildList />
            </ListItem>
            <ListItem className={classes.listItem}>
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
