import { EnvUtils } from './EnvUtils';

describe('EnvUtils - route matching', () => {
  it('matches end route', () => {
    expect(EnvUtils.mapRoute('/Users').title).toEqual(undefined);
  });
});
