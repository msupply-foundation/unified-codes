import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../../types';

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
import { DetailActions, IDetailAction } from '../../../actions';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      '& p': { color: theme.palette.action.active },
      width: '100%',
    },
  })
);

const useViewEntity = () => {
  const history = useHistory();
  return (code?: string) => code && history.push(`/detail/${code}`);
};

interface DetailEntityListItemProps {
  childEntities?: IEntity[];
  code?: string;
  description?: string;
  fetchEntity?: (code: string) => void;
}

export type DetailEntityListItem = React.FunctionComponent<DetailEntityListItemProps>;

const DetailEntityListItemComponent: DetailEntityListItem = ({
  childEntities,
  code,
  description,
  fetchEntity,
}) => {
  const classes = useStyles();
  const viewEntity = useViewEntity();

  const { isOpen, onToggle } = useToggle(false);

  const { length: childCount } = childEntities ?? [];

  const EntityListToggleItemText = () => {
    const itemText = !!childCount ? `${description} (${childCount})` : description;
    const secondaryText = !childCount ? code : undefined;

    return <ListItemText primary={itemText} secondary={secondaryText} />;
  };

  const EntityListToggleItemIcon = isOpen ? ArrowUpIcon : ArrowDownIcon;
  const onEntityClick = () => {
    if (!code) return;
    fetchEntity && fetchEntity(code);
    viewEntity(code);
  };

  const EntityListToggleItem = () =>
    !!childCount ? (
      <ListItem button onClick={onToggle}>
        <EntityListToggleItemText />
        <ListItemIcon>
          <EntityListToggleItemIcon />
        </ListItemIcon>
      </ListItem>
    ) : (
      <ListItem button onClick={onEntityClick}>
        <EntityListToggleItemText />
      </ListItem>
    );

  const EntityListChildItems = React.useCallback(() => {
    if (!childCount) return null;
    const childItems = childEntities?.map((child: IEntity) => {
      const { description, children } = child;
      return (
        <DetailEntityListItem
          description={description}
          childEntities={children}
          key={child.code}
          code={child.code}
        />
      );
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

const mapDispatchToProps = (dispatch: React.Dispatch<IDetailAction>) => {
  const fetchEntity = (code: string) => {
    dispatch(DetailActions.fetchEntity(code));
  };
  return { fetchEntity };
};

const mapStateToProps = (_: IState) => ({});

const DetailEntityListItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailEntityListItemComponent);

export default DetailEntityListItem;
