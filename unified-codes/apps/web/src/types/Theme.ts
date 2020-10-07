import { Theme as MTheme, ThemeOptions as MThemeOptions } from '@material-ui/core/styles';
import { Palette as MPalette } from '@material-ui/core/styles/createPalette';

export type Theme = MTheme;
export type ThemeOptions = MThemeOptions;
export type Palette = MPalette;

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
