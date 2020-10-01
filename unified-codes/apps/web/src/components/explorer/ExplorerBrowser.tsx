import { EntityBrowser } from '@unified-codes/ui';

import { withStyles } from '../../styles';
import { ITheme } from '../../types';

const styles = (theme: ITheme) => ({
    root: {
        width: '100%',
    },
    tableContainer: {
        backgroundColor: theme.palette.background.default,
        margin: '0 auto 0 auto',
        maxHeight: '100%',
        maxWidth: 900,
        width: '60%',
        borderRadius: 5,
    },
    searchBarContainer: {
        backgroundColor: theme.palette.background.default,
        margin: '-20px auto 0 auto',
        maxWidth: 900,
        width: '60%',
        borderRadius: 5,
    },
    toggleBarContainer: {
        backgroundColor: theme.palette.background.footer,
        paddingBottom: 24,
    },
});

export const ExplorerBrowser = withStyles(styles)(EntityBrowser);

export default ExplorerBrowser;