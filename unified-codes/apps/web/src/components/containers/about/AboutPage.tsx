import * as React from 'react';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';
import { ITheme } from '../../../styles';

import AboutContent from './AboutContent';
import AboutLayout from '../../layout/AboutLayout';

const useStyles = makeStyles((_: ITheme) =>
  createStyles({
    root: {
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      padding: '20px 0 20px 0',
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: '20px 0 20px 0',
      '& div': { marginBottom: 25 },
    },
  })
);

export interface AboutPageProps {
  onMount?: ({}) => void;
  onUnmount?: ({}) => void;
}

export type AboutPage = React.FunctionComponent<AboutPageProps>;

export const AboutPage: AboutPage = ({ onMount = ({}) => null, onUnmount = ({}) => null }) => {
  const classes = useStyles();

  return <AboutLayout classes={classes} content={<AboutContent />} />;
};

export default AboutPage;
