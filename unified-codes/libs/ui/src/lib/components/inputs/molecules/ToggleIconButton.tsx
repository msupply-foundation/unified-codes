import * as React from 'react';

import { IconButton } from '../atoms';
import { ArrowUpIcon, ArrowDownIcon } from '../../icons';

export interface ToggleIconButtonProps {
    classes?: { root?: string; };
    isOpen: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type ToggleIconButton = React.FunctionComponent<ToggleIconButtonProps>;

export const ToggleIconButton: ToggleIconButton = ({ classes, isOpen, onClick }) => {
    const ArrowIcon = () => isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />;

    return (
        <IconButton className={classes?.root} onClick={onClick}>
            <ArrowIcon/>
        </IconButton>
    );
};

export default ToggleIconButton;

