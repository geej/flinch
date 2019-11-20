import Primitive from '../Primitive';

describe('Primitive', () => {
  test('constructor should call update with value', () => {
    const node = new Primitive('value');
    expect(node.value).toEqual('value');
  });

  test('update should set value', () => {
    const node = new Primitive();
    node.update('new value');
    expect(node.value).toEqual('new value');
  });

  test('update should set empty string on null or undefined', () => {
    const node = new Primitive();
    node.update(null);
    expect(node.value).toEqual('');
    node.update(undefined);
    expect(node.value).toEqual('');
    node.update(0);
    expect(node.value).toEqual(0);
  });

  test('draw should throw', () => {
    const node = new Primitive();
    expect(() => node.draw()).toThrow();
  });
});
