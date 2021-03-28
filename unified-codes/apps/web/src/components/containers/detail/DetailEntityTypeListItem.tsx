import * as React from 'react';

import { EEntityType, IEntity } from '@unified-codes/data/v1';

import { ListItem } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailEntityList from './DetailEntityList';

import { ITheme } from '../../../styles';
import { typeFormatter } from '../../../typeFormats';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    item: {
      margin: '0px 0px 0px 0px',
      padding: '0px 0px 0px 0px',
      width: '100%',
      '& p': { color: theme.palette.action.active },
    }
  })
);

interface DetailEntityTypeListItemProps {
    type: string,
    parent: IEntity,
    entities: IEntity[],
};
  
export type DetailEntityTypeListItem = React.FunctionComponent<DetailEntityTypeListItemProps>;

export const DetailEntityTypeListItem: DetailEntityTypeListItem = ({ type, parent, entities }) => {
    const classes = useStyles();

    const entityCount = entities?.length;
 
    const typeFormatted = typeFormatter(type);
    const description = `${typeFormatted} (${entityCount})`;

    return (
        <ListItem key={type} className={classes.item}>
            <DetailEntityList description={description} parent={parent} entities={entities}/>
        </ListItem>
    );
};

export default DetailEntityTypeListItem;
