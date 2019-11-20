jest.mock('../util', () => ({
  updateNode: jest.fn(),
  findClosestAncestorWhere: jest.fn(),
  getFlatChildren: jest.fn()
}));

import FunctionalNode from '../FunctionalNode';

describe('FunctionalNode', () => {
  test('render should call component function', () => {
    const fn = jest.fn(() => 'result');
    const node = new FunctionalNode(fn, { myProp: 1 });

    const result = node.render();

    expect(fn).toHaveBeenCalledWith({ myProp: 1 });
    expect(result).toEqual('result');
  });
});