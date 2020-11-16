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
      width: '100%',

      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
    },
    product: {
      width: '100%',
    },
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

  if (!product) return null;

  const onProductClick = () => {
    if (!product.code) return;
    fetchEntity && fetchEntity(product.code);
    viewEntity(product.code);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="subtitle1">Product</Typography>
      <Typography className={classes.product} onClick={onProductClick}>
        {product.description}
        {product.code && <span>{product.code}</span>}
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
