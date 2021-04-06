import * as React from 'react';

import { IconButton } from '../atoms';
import { FileCopyIcon } from '../../icons';

export interface CopyIconButtonProps {
    classes?: { root?: string; };
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type CopyIconButton = React.FunctionComponent<CopyIconButtonProps>;

export const CopyIconButton: CopyIconButton = ({ classes, onClick }) => {
    return (
        <IconButton className={classes?.root} onClick={onClick}>
            <FileCopyIcon/>
        </IconButton>
    );
};

export default CopyIconButton;

