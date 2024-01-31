import { getParentDescription } from './helpers';

describe('getParentDescription', () => {
  it('returns full description when name doesnt match', () => {
    expect(
      getParentDescription({ description: 'some description', name: 'name' })
    ).toEqual('some description');
  });

  it('returns description with name removed', () => {
    expect(
      getParentDescription({
        description: 'some description name',
        name: 'name',
      })
    ).toEqual('some description');
  });

  it('returns description correctly when name is also in the middle', () => {
    expect(
      getParentDescription({
        description: 'description name bla name',
        name: 'name',
      })
    ).toEqual('description name bla');
  });
});
