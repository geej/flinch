jest.mock('../util', () => ({
  __esModule: true,
  default: {
    updateNode: jest.fn(),
    findClosestAncestorWhere: jest.fn(),
    getFlatChildren: jest.fn(),
    cleanProps: jest.fn()
  }
}));

import Fragment from '../Fragment';

describe('Fragment', () => {
  test('render should return children', () => {
    const node = new Fragment(null, { children: [ 1, 2, 3 ] });
    expect(node.render()).toEqual([ 1, 2, 3 ]);
  });
});