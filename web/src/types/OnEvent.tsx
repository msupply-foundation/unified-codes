import * as React from 'react';

export type OnEvent<T> = OnChange<T> & OnClick<T>;

export type OnChange<T> = (event: React.ChangeEvent<T>) => void;
export type OnClick<T> = (event: React.MouseEvent<T>) => void;

export type InputChangeElement = HTMLTextAreaElement | HTMLInputElement;
export type ButtonClickElement = HTMLButtonElement | MouseEvent;