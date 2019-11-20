import Util from '..';

describe('Util', () => {
  describe('getFlatChildren', () => {
    test('returns empty array if no children', () => {
      expect(Util.getFlatChildren()).toEqual([]);
    });

    test('converts single child to array', () => {
      expect(Util.getFlatChildren('test')).toEqual([ 'test' ]);
    });

    test('flattens array if nested array', () => {
      expect(Util.getFlatChildren([ [ 'a', [ 'b' ] ], 'c'])).toEqual([ 'a', 'b', 'c' ]);
    });
  });

  describe('updateNode', () => {

  });

  describe('cleanProps', () => {

  });

  describe('cloneNode', () => {

  });

  describe('findClosestAncestorWhere', () => {

  });
});