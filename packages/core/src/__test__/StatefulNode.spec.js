jest.mock('../util', () => ({
  updateNode: jest.fn(),
  findClosestAncestorWhere: jest.fn(),
  getFlatChildren: jest.fn()
}));

import StatefulNode from '../StatefulNode';

describe('StatefulNode', () => {
  let node;

  beforeAll(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterAll(() => {
    window.requestAnimationFrame.mockRestore();
  });

  beforeEach(() => {
    node = new StatefulNode();
    jest.spyOn(node, 'forceUpdate').mockImplementation(() => {});
  });

  test('setState should set state', () => {
    node.setState({ a: 1 });

    expect(node.state).toEqual({ a: 1 });
  });

  test('setState should merge with existing state', () => {
    node.state = { b: 2 };
    node.setState({ a: 1 });

    expect(node.state).toEqual({ a: 1, b: 2 });
  });

  test('setState should call function with current state', () => {
    const fn = jest.fn(() => ({ a: 1 }));
    node.state = { b: 2 };
    node.setState(fn);

    expect(fn).toHaveBeenCalledWith({ b: 2 });
    expect(node.state).toEqual({ a: 1, b: 2 });
  });

  test('calls forceUpdate with provided callback', () => {
    const fn = jest.fn();
    node.setState({ a: 1 }, fn);

    expect(node.forceUpdate).toHaveBeenCalledWith(fn);
  });
});