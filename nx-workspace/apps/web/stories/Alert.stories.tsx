import * as React from "react";
import { Alert } from "../src/components";

export default { title: "Alert" };

export const errorAlert = () => {
  return <Alert severity="error">This is an error message!</Alert>;
};
export const warningAlert = () => {
  return <Alert severity="warning">This is a warning message!</Alert>;
};
export const informationAlert = () => {
  return <Alert severity="info">This is an information message</Alert>;
};
export const successAlert = () => {
  return <Alert severity="success">This is a success message!</Alert>;
};
