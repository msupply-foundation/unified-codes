import { createMuiTheme, Theme } from '@material-ui/core/styles';

const theme: Theme = createMuiTheme({
  palette: {
    background: {
      default: 'white',
      paper: 'white',
    },
    divider: '#253240',
    text: {
      primary: 'rgba(0,0,0,0.83)',
      hint: 'rgba(0,0,0,0.6)',
    },
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
      lineHeight: '15px',
      textTransform: 'uppercase',
    },
    subtitle2: {
      color: '#C4EADC',
      fontFamily: 'roboto',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 0.12,
      lineHeight: '15px',
      textTransform: 'uppercase',
    },
  },
});

export default theme;
