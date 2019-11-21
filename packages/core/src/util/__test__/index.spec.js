import Util from '..';
import Node from '../../Node';
import Fragment from '../../Fragment';
import Primitive from '../../Primitive';

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
    describe('primitive cases', () => {
      describe('new node without old node should return node with value', () => {
        const result = Util.updateNode(null, undefined, 'a');
        expect(result instanceof Primitive).toBe(true);
        expect(result.value).toBe('a');
      });

      describe('new node with primitive old node should replace value on old node', () => {
        const oldPrimitive = new Primitive('a');
        const result = Util.updateNode(null, oldPrimitive, 'b');
        expect(result).toBe(oldPrimitive);
        expect(oldPrimitive.value).toBe('b');
      });

      describe('new node with non-primitive old node should unmount old node', () => {
        const oldNode = new Node();
        jest.spyOn(oldNode, 'unmount');

        Util.updateNode(null, oldNode, 'a');

        expect(oldNode.unmount).toHaveBeenCalled();
      });
    });

    describe('node cases', () => {
      test('if nodes are not compatible, unmount and replace old node', () => {
        const oldNode = new Node(null, { key: 1 });
        jest.spyOn(oldNode, 'unmount');
        const newNode = new Node(null, { key: 2 });
        jest.spyOn(newNode, 'render').mockReturnValue([]);

        const result = Util.updateNode(null, oldNode, newNode);

        expect(oldNode.unmount).toHaveBeenCalled();
        expect(result).toBe(newNode);
      });
    });

    test('if newNode is a fragment, it should be cloned', () => {
      const oldNode = new Node(null, { key: 1 });
      const newNode = new Fragment(null, { key: 2 });

      const result = Util.updateNode(null, oldNode, newNode);

      expect(result instanceof Fragment).toBe(true);
      expect(result).not.toBe(newNode);
    });

    test('if oldNode and newNode are compatible, update oldNode', () => {
      const oldNode = new Node(null, { key: 1 });
      const newNode = new Node(null, { key: 1, a: 1 });
      jest.spyOn(oldNode, 'render').mockReturnValue([]);
      jest.spyOn(oldNode, 'update');
      const result = Util.updateNode(null, oldNode, newNode);

      expect(oldNode.update).toHaveBeenCalledWith({ key: 1, a: 1 });
      expect(result).toBe(oldNode);
    });

    test('unmounts oldNode if newNode is a primitive', () => {

    })
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