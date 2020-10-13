import * as React from 'react';

import { Box } from '@unified-codes/ui/components';

export interface DetailLayoutProps {
    attributeList: React.ReactElement;
    childList: React.ReactElement;
    propertyList: React.ReactElement;
}

export type DetailLayout = React.FunctionComponent<DetailLayoutProps>;

export const DetailLayout: DetailLayout = ({ attributeList, childList, propertyList }) => (
    <Box>
        {attributeList}
        {childList}
        {propertyList}
    </Box>
);

export default DetailLayout;
