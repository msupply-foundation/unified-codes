import React from 'react';
import FormCapsuleIcon from './FormCapsuleIcon';
import FormInjectionIcon from './FormInjectionIcon';
import FormLiquidIcon from './FormLiquidIcon';
import FormTabletIcon from './FormTabletIcon';

interface FormIconProps {
  form?: string;
}

export type FormIconType = React.FunctionComponent<FormIconProps>;

export const FormIcon: FormIconType = ({ form }) => {
  if (!form) return null;

  switch (form) {
    case 'capsule':
      return <FormCapsuleIcon height={24} width={24} />;

    case 'injection':
      return <FormInjectionIcon height={24} width={24} />;

    case 'liquid':
    case 'oral liquid':
      return <FormLiquidIcon height={24} width={24} />;

    case 'tablet':
      return <FormTabletIcon height={24} width={24} />;

    default:
      return null;
  }
};
