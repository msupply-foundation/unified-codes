import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const DownloadIcon = (props: SvgIconProps): JSX.Element => {
  return (
    <SvgIcon {...props} viewBox="0 0 21 20">
      <path d="M17.5 13.333c.46 0 .833.373.833.834v2.5c0 1.38-1.119 2.5-2.5 2.5H4.167c-1.381 0-2.5-1.12-2.5-2.5v-2.5c0-.46.373-.834.833-.834.46 0 .833.373.833.834v2.5c0 .46.373.833.834.833h11.666c.46 0 .834-.373.834-.833v-2.5c0-.46.373-.834.833-.834zM10 .833c.46 0 .833.373.833.834v9.654l1.911-1.91c.298-.299.767-.323 1.093-.075l.086.075c.325.325.325.853 0 1.178l-3.334 3.334-.014.014c-.017.016-.036.032-.055.047l-.025.02c-.023.017-.047.033-.072.048l-.016.009-.074.037-.023.01-.056.02c-.17.053-.354.052-.523-.006l-.037-.013-.043-.019c-.02-.009-.037-.018-.055-.028l-.028-.016c-.023-.014-.044-.028-.065-.043-.032-.024-.063-.05-.092-.08l.074.066c-.022-.018-.044-.037-.064-.057l-.01-.01-3.334-3.333c-.325-.325-.325-.853 0-1.178.326-.326.853-.326 1.179 0l1.91 1.91V1.666c0-.425.319-.776.73-.827z" />
    </SvgIcon>
  );
};
