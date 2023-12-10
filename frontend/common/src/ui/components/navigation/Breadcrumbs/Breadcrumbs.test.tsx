import React from 'react';
import { AppRoute } from '@uc-frontend/config';
import { render } from '@testing-library/react';
import {
  RouteBuilder,
  TestingProvider,
  TestingRouter,
} from '../../../../utils';
import { Route } from 'react-router';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('Renders the names of all the routes from the URL', () => {
    const { getByText } = render(
      <TestingProvider>
        <TestingRouter
          initialEntries={[
            RouteBuilder.create(AppRoute.Login)
              .addPart(AppRoute.Admin)
              .addPart(AppRoute.ForgotPassword)
              .build(),
          ]}
        >
          <Route path="*" element={<Breadcrumbs />}></Route>
        </TestingRouter>
      </TestingProvider>
    );

    expect(getByText(/admin/i)).toBeInTheDocument();
    expect(getByText(/forgot/i)).toBeInTheDocument();
  });
});
