import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { IEntity } from '@unified-codes/data/v1';
import { Container, Typography } from '@unified-codes/ui/components';
import Link from '@material-ui/core/Link';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { DetailActions, IDetailAction } from '../../../actions';

import { createStyles, makeStyles } from '@unified-codes/ui/styles';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
    },
    code: { color: theme.palette.action.active, display: 'block', fontSize: '0.8rem' },
    product: {
      cursor: 'pointer',
      marginBottom: 10,
      padding: 10,
      width: '100%',
    },
    title: { color: theme.palette.background.footer, paddingTop: 10 },
  })
);

const useViewEntity = () => {
  const history = useHistory();
  return (code?: string) => code && history.push(`/detail/${code}`);
};

export interface DetailProductProps {
  entity: IEntity;
  fetchEntity?: (code: string) => void;
}

export type DetailProduct = React.FunctionComponent<DetailProductProps>;

export const DetailProductComponent: DetailProduct = ({ entity, fetchEntity }) => {
  const classes = useStyles();
  const viewEntity = useViewEntity();

  const { product } = entity ?? {};
  const { code, description } = product ?? {};

  if (!code) return null;

  const onProductClick = () => {
    if (!code) return;
    fetchEntity && fetchEntity(code);
    viewEntity(code);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="subtitle1" className={classes.title}>
        Product
      </Typography>
      <Typography className={classes.product} onClick={onProductClick}>
        {description}
        <span className={classes.code}>{code}</span>
      </Typography>
    </Container>
  );
};

const mapStateToProps = (state: IState) => {
  const entity = DetailSelectors.selectEntity(state);
  return { entity };
};

const mapDispatchToProps = (dispatch: React.Dispatch<IDetailAction>) => {
  const fetchEntity = (code: string) => {
    dispatch(DetailActions.fetchEntity(code));
  };
  return { fetchEntity };
};

export const DetailProduct = connect(mapStateToProps, mapDispatchToProps)(DetailProductComponent);

export default DetailProduct;
