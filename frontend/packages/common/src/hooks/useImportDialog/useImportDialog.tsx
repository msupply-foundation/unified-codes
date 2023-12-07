import React, { useEffect } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import { SxProps, Theme, Alert, Grid } from '@mui/material';
import { DialogProps } from '../useDialog';

import { BasicModal, ModalTitle } from '../../ui/components/modals';

export interface ImportDialogButtonProps {
  icon?: React.ReactElement;
  label?: string;
  onClick?: () => void;
  visible?: boolean;
}

export interface ImportDialogProps {
  contentProps?: DialogContentProps;
  children: React.ReactElement<any, any>;
  cancelButton?: JSX.Element;
  height?: number;
  nextButton?: JSX.Element;
  backButton?: JSX.Element;
  actionButton?: JSX.Element;
  exportButton?: JSX.Element;
  stepper?: React.ReactElement<any, any>;
  errorMessage?: string;
  width?: number;
  sx?: SxProps<Theme>;
  title: string;
}

interface DialogState {
  Modal: React.FC<ImportDialogProps>;
  hideDialog: () => void;
  open: boolean;
  showDialog: () => void;
}

export const useImportDialog = (dialogProps?: DialogProps): DialogState => {
  const { onClose, isOpen } = dialogProps ?? {};
  const [open, setOpen] = React.useState(false);
  const showDialog = () => setOpen(true);
  const hideDialog = () => setOpen(false);

  useEffect(() => {
    if (isOpen != null) setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onClose && onClose();
    hideDialog();
  };

  const ModalComponent: React.FC<ImportDialogProps> = ({
    cancelButton,
    children,
    height,
    nextButton,
    backButton,
    exportButton,
    actionButton,
    width,
    title,
    stepper,
    errorMessage,
    contentProps,
    sx = {},
  }) => {
    const { sx: contentSX, ...restOfContentProps } = contentProps ?? {};
    const dimensions = {
      height: height ? Math.min(window.innerHeight - 50, height) : undefined,
      width: width ? Math.min(window.innerWidth - 50, width) : undefined,
    };

    return (
      <BasicModal
        open={open}
        onClose={handleClose}
        width={dimensions.width}
        height={dimensions.height}
        sx={sx}
      >
        {title ? <ModalTitle title={title} /> : null}
        <Grid
          sx={{ padding: '0px 24px' }}
          flexDirection="column"
          display="flex"
          gap={1}
        >
          {stepper}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        </Grid>
        <DialogContent
          {...restOfContentProps}
          sx={{ overflowX: 'hidden', ...contentSX }}
        >
          {children}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            marginBottom: '30px',
            marginTop: '30px',
          }}
        >
          {backButton}
          {cancelButton}
          {actionButton}
          {exportButton}
          {nextButton}
        </DialogActions>
      </BasicModal>
    );
  };

  const Modal = React.useMemo(() => ModalComponent, [open]);

  return { hideDialog, Modal, open, showDialog };
};
