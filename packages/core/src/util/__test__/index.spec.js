import Util from '..';
import Node from '../../Node';

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
    test('should return undefined if no props', () => {
      expect(Util.cleanProps()).toEqual(undefined);
    });

    test('should pluck undefined values', () => {
      expect(Util.cleanProps({ a: undefined, b: 1 })).toEqual({ b: 1 });
    });
  });

  describe('cloneNode', () => {
    test('should copy node and retain prototype and values', () => {
      const node = new Node();
      node.setting = 'value';
      const newNode = Util.cloneNode(node);

      expect(node).not.toBe(newNode);
      expect(newNode.setting).toEqual('value');
      expect(newNode instanceof Node).toBe(true);
    });
  });

  describe('findClosestAncestorWhere', () => {
    const node1 = new Node();
    const node2 = new Node();
    const node3 = new Node();
    node1.parent = node2;
    node2.parent = node3;
    node3.matches = true;

    test('finds node that matches criteria', () => {
      expect(Util.findClosestAncestorWhere(node1, node => node.matches)).toBe(node3);
    });

    test('returns undefined if no node matches criteria', () => {
      expect(Util.findClosestAncestorWhere(node1, node => node.notAValue)).toBeFalsy();
    });
  });
});