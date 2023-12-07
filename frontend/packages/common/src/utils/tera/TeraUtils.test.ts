import { TeraUtils } from './TeraUtils';

describe('TeraUtils', () => {
  it('Should extract a single param', () => {
    expect(TeraUtils.extractParams('Hello {{name}}!')).toEqual(['name']);
  });
  it('Should extract a single param with spaces ', () => {
    expect(TeraUtils.extractParams('Hello {{ name }}!')).toEqual(['name']);
  });
  it('Should not extract a broken parameter', () => {
    expect(TeraUtils.extractParams('Hello {{ name }!')).toEqual([]);
  });
  it('Should extract a parameter including a dot', () => {
    // In future we might want to parse this into a hierarchical structure? e.g. [{"data": [name]}]
    expect(TeraUtils.extractParams('Hello {{ data.name }}!')).toEqual([
      'data.name',
    ]);
  });
});

describe('keyedParamsAsTeraJson', () => {
  it('Should convert a single key', () => {
    expect(TeraUtils.keyedParamsAsTeraJson({ name: 'John' })).toEqual(
      '{"name":"John"}'
    );
  });
  it('Should convert 2 single keys', () => {
    expect(
      TeraUtils.keyedParamsAsTeraJson({
        name: 'John',
        email: 'john@example.com',
      })
    ).toEqual('{"name":"John","email":"john@example.com"}');
  });
  it('Should convert a single key with a dot', () => {
    expect(TeraUtils.keyedParamsAsTeraJson({ 'user.name': 'John' })).toEqual(
      '{"user":{"name":"John"}}'
    );
  });
  it('Should convert a multiple keys with a dot', () => {
    expect(
      TeraUtils.keyedParamsAsTeraJson({
        'user.name': 'John',
        'user.email': 'john@example.com',
      })
    ).toEqual('{"user":{"name":"John","email":"john@example.com"}}');
  });
});

describe('keyedParamsFromTeraJson', () => {
  it('Should convert a single key', () => {
    expect(TeraUtils.keyedParamsFromTeraJson('{"name":"John"}')).toEqual({
      name: 'John',
    });
  });
  it('Should convert nested keys', () => {
    expect(
      TeraUtils.keyedParamsFromTeraJson(
        '{"user": {"name":"John","email":"john@example.com"}, "organisation": {"name": "Example Org"}}'
      )
    ).toEqual({
      'user.name': 'John',
      'user.email': 'john@example.com',
      'organisation.name': 'Example Org',
    });
  });
  it('Should convert a single nested key', () => {
    expect(
      TeraUtils.keyedParamsFromTeraJson('{"user":{"name":"John"}}')
    ).toEqual({ 'user.name': 'John' });
  });
  it('Should convert a deeply nested key', () => {
    expect(
      TeraUtils.keyedParamsFromTeraJson(
        '{"user":{"name":"John", "address": {"city": "London"}}}'
      )
    ).toEqual({ 'user.name': 'John', 'user.address.city': 'London' });
  });
});
