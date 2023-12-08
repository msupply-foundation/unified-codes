import { AppRoute } from '@uc-frontend/config';
import { RouteBuilder } from './RouteBuilder';

describe('Formatters', () => {
  it('builds a route with an appended wildcard', () => {
    expect(RouteBuilder.create(AppRoute.Admin).addWildCard().build()).toBe(
      '/admin/*'
    );
  });

  it('builds a route', () => {
    expect(
      RouteBuilder.create(AppRoute.Login).addPart(AppRoute.Admin).build()
    ).toBe('/login/admin');
  });

  it('can be used to create multiple routes from the same builder', () => {
    expect(RouteBuilder.create(AppRoute.Admin).build()).toBe('/admin');
    expect(RouteBuilder.create(AppRoute.PageNotFound).build()).toBe(
      '/page-not-found'
    );
  });
});
