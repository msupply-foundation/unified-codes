import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

export interface PropertyBrowserProps {
  onReady: () => void;
}

export type PropertyBrowser = React.FunctionComponent<PropertyBrowserProps>;

export const PropertyBrowserComponent : PropertyBrowser = ({ onReady }) => {
  const { code } = useParams();
  const placeholderText = `A property browser page for ${code}`;
  return <div>{placeholderText}</div>;
}

const mapStateToProps = () => {
  return { };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const onReady = () => console.log('onReady');
  return { onReady };
};

export const PropertyBrowser = connect(mapStateToProps, mapDispatchToProps)(PropertyBrowserComponent);
export default PropertyBrowser;