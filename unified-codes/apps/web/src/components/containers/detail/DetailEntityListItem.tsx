import * as React from 'react';

import { IEntity } from '@unified-codes/data';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, ArrowUpIcon, ArrowDownIcon } from '@unified-codes/ui/components'
import { useToggle } from '@unified-codes/ui/hooks';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) => createStyles({
    root: {
        width: '100%',
    }
}));

interface DetailEntityListItemProps {
    description?: string;
    children?: IEntity[];
}

export type DetailEntityListItem = React.FunctionComponent<DetailEntityListItemProps>;

const DetailEntityListItem: DetailEntityListItem = ({ description, children }) => {
    const classes = useStyles();

    const { isOpen, onToggle } = useToggle(false);

    const Parent = () => {
        const ToggleIcon = () => {
            if (!children?.length) return null;
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

    const Children = React.useCallback(() => (
        <List>
            {children?.map((child: IEntity) => <DetailEntityListItem description={child.description} children={child.children}/>)}
        </List>
    ), [children]);

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

export default DetailEntityListItem;