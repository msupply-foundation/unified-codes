export type FlexDisplay = 'flex';
export type FlexGrow = number;
export type FlexDirection = 'column' | 'row';

export type FlexProps = {
    display?: FlexDisplay,
    flexGrow?: FlexGrow,
    flexDirection?: FlexDirection,
}

export const flexStyle: { display: FlexDisplay } = {
    display: 'flex',
};

export const flexContainerStyle: { display: FlexDisplay, flexGrow: FlexGrow } = {
    ...flexStyle,
    flexGrow: 1,
}

export const flexRowStyle: { display: FlexDisplay, flexDirection: FlexDirection } = {
    ...flexContainerStyle,
    flexDirection: 'row',
};

export const flexColumnStyle: { display: FlexDisplay, flexDirection: FlexDirection } = {
    ...flexContainerStyle,
    flexDirection: 'column',
};

export default {
    flexStyle,
    flexRowStyle,
    flexColumnStyle
};