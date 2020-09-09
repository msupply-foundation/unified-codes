import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core/styles';
import { Palette } from '@material-ui/core/styles/createPalette';

interface IPalette extends Palette {
  background: {
    default: string;
    paper: string;
    toolbar: string;
  };
}
export interface ITheme extends Theme {
  palette: IPalette;
}

interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
}

const theme: Theme = createMuiTheme({
  palette: {
    action: {
      active: '#5CCDF4',
      selected: '#2B83A1',
    },
    background: {
      default: 'white',
      paper: '#f9f9fb',
      toolbar: '#D4EEF7',
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
} as IThemeOptions);

export default theme;

export type flexDirection = 'column' | 'row';
export type position = 'fixed' | 'absolute';
