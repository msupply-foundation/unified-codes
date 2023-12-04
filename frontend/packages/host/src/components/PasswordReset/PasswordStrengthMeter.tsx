import React, { FC } from 'react';
import { Box, Tooltip, Typography, useTranslation } from '@uc-frontend/common';
import LinearProgress from '@mui/material/LinearProgress';
import zxcvbn, { IZXCVBNResult } from 'zxcvbn-typescript';

type PasswordFeedbackProps = {
  result: IZXCVBNResult;
  showFeedback?: boolean;
};
const PasswordFeedback: FC<PasswordFeedbackProps> = ({
  result,
  showFeedback,
}) => {
  const t = useTranslation(['host']);
  if (!result || !showFeedback) return null;

  let strengthText = t('messages.password-weak');
  switch (result.score) {
    case 0:
      strengthText = t('messages.password-poor');
      break;
    case 1:
      strengthText = t('messages.password-weak');
      break;
    case 2:
      strengthText = t('messages.password-notbad');
      break;
    case 3:
      strengthText = t('messages.password-great');
      break;
    case 4:
      strengthText = t('messages.password-excellent');
      break;
    default:
      strengthText = t('messages.unknown');
      break;
  }

  return (
    <Tooltip title={result.score <= 2 ? result.feedback.suggestions : ''}>
      <Typography>
        <b>{t('label.password-strength')}: </b>
        {(result.feedback.warning !== '' && result.feedback.warning) ||
          strengthText}
      </Typography>
    </Tooltip>
  );
};

const passwordColour = (result: IZXCVBNResult) => {
  switch (result.score) {
    case 0:
      return 'error';
    case 1:
      return 'warning';
    case 2:
      return 'info';
    case 3:
      return 'success';
    case 4:
      return 'success';
    default:
      return 'primary';
  }
};

interface PasswordStrengthMeterInputProps {
  password: string | undefined;
  userInfo: string[];
  includeFeedback?: boolean;
}

export const PasswordStrengthMeter: FC<PasswordStrengthMeterInputProps> = ({
  password,
  userInfo,
  includeFeedback,
}) => {
  const passwordStrength = zxcvbn(password ?? '', userInfo);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <LinearProgress
        variant="determinate"
        color={passwordColour(passwordStrength)}
        value={((passwordStrength.score + 1) * 100) / 5}
      />
      <PasswordFeedback
        showFeedback={includeFeedback}
        result={passwordStrength}
      />
    </Box>
  );
};

export default PasswordStrengthMeter;
