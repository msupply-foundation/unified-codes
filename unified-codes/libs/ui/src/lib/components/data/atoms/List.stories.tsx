import * as React from 'react';

import { 
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@unified-codes/ui/components';

import { createStyles, makeStyles, Theme } from '@unified-codes/ui/styles';
import { useToggle } from '@unified-codes/ui/hooks';

import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from '../../icons';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
        },
        nestedFirst: {
            paddingLeft: theme.spacing(4),
        },
        nestedSecond: {
            paddingLeft: theme.spacing(8),
        }
    })
);

export default {
  component: List,
  title: 'List',
};

export const Default = () => ( 
    <List>
        <ListItem>
            <ListItemText primary="Item 1"/>
        </ListItem>
        <ListItem>
            <ListItemText primary="Item 2"/>
        </ListItem>
        <ListItem>
            <ListItemText primary="Item 3"/>
        </ListItem>
    </List>
);


export const Button = () => ( 
    <List>
        <ListItem button>
            <ListItemText primary="Item 1"/>
        </ListItem>
        <ListItem button>
            <ListItemText primary="Item 2"/>
        </ListItem>
        <ListItem button>
            <ListItemText primary="Item 3"/>
        </ListItem>
    </List>
);


export const Divider = () => ( 
    <List>
        <ListItem divider>
            <ListItemText primary="Item 1"/>
        </ListItem>
        <ListItem divider>
            <ListItemText primary="Item 2"/>
        </ListItem>
        <ListItem divider>
            <ListItemText primary="Item 3"/>
        </ListItem>
    </List>
);

export const Icon = () => ( 
    <List>
        <ListItem>
            <ListItemIcon>
                <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary="Item 1"/>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary="Item 2"/>
        </ListItem>
        <ListItem>
            <ListItemIcon>
                <ArrowRightIcon/>
            </ListItemIcon>
            <ListItemText primary="Item 3"/>
        </ListItem>
    </List>
);

export const Nested = () => {
    const classes = useStyles();
    
    const { isOpen: isOpenFirst, onToggle: onToggleFirst } = useToggle(false);
    const { isOpen: isOpenSecond, onToggle: onToggleSecond } = useToggle(false);

    const IconFirst = React.useCallback(() => isOpenFirst ? <ArrowUpIcon/> : <ArrowDownIcon/>, [isOpenFirst]);
    const IconSecond = React.useCallback(() => isOpenSecond ? <ArrowUpIcon/> : <ArrowDownIcon/>, [isOpenSecond]);

    return (
        <List>
            <ListItem button onClick={onToggleFirst}>
                <ListItemText primary="Item 1"/>
                <ListItemIcon>
                    <IconFirst/>
                </ListItemIcon>
            </ListItem>
            <Collapse in={isOpenFirst} unmountOnExit>
                <List>
                    <ListItem button className={classes.nestedFirst} onClick={onToggleSecond}>
                        <ListItemText primary="Item 2"/>
                            <ListItemIcon>
                                <IconSecond/>
                            </ListItemIcon>
                    </ListItem>
                    <Collapse in={isOpenSecond} unmountOnExit>
                        <List>
                            <ListItem className={classes.nestedSecond}>
                                <ListItemText primary="Item 3"/>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Collapse>
        </List>
    );
};