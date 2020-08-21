import { createMuiTheme, Theme } from '@material-ui/core/styles';

const theme: Theme = createMuiTheme({
  palette: {
    background: {
      default: 'white',
      paper: 'white',
    },
    divider: '#253240',
  },
  typography: {
    body1: {
      fontFamily: 'roboto',
    },
    body2: {
      fontFamily: 'roboto',
    },
    subtitle1: {
      color: '#FFF',
      fontFamily: 'roboto',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 0.12,
      lineHeight: 15,
      textAlign: 'right',
    },
  },
});

export default theme;
