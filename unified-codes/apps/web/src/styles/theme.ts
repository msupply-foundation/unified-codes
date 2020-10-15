import { createMuiTheme, Palette, Theme, ThemeOptions } from '@unified-codes/ui/styles';

export interface IPalette extends Palette {
  background: {
      default: string;
      footer: string;
      paper: string;
      toolbar: string;
  };
}

export interface ITheme extends Theme {
  palette: IPalette;
}

export interface IThemeOptions extends ThemeOptions {
  palette: IPalette;
}


export const theme: Theme = createMuiTheme({
  palette: {
    action: {
      active: '#5CCDF4',
      selected: '#2B83A1',
    },
    background: {
      default: 'white',
      footer: '#253240',
      paper: '#f9f9fb',
      toolbar: '#D4EEF7',
    },
    divider: 'rgba(102,102,102,0.52)',
    text: {
      primary: 'rgba(0,0,0,0.83)',
      secondary: 'rgba(255,255,255,0.87)',
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
} as ThemeOptions);

export default theme;

