import React from 'react';
import { render } from '@testing-library/react';

import Table from "./Table";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableRow from "./TableRow";
import TableHead from "./TableHead";

describe(' TableCell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Table>
        <TableHead><TableRow><TableCell/></TableRow></TableHead>
        <TableBody><TableRow><TableCell/></TableRow></TableBody>
      </Table>
    );
    expect(baseElement).toBeTruthy();
  });
});
