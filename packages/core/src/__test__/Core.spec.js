jest.mock('../util', () => ({
  __esModule: true,
  default: {
    updateNode: jest.fn(),
    findClosestAncestorWhere: jest.fn(),
    getFlatChildren: jest.fn(),
    cleanProps: jest.fn()
  }
}));

import Util from '../util';
import Core from '../Core';
import Primitive from '../Primitive';
import FunctionalNode from '../FunctionalNode';
import StatefulNode from '../StatefulNode';
import Fragment from '../Fragment';

describe('Core', () => {
  test('registerPrimitive registers primitive type', () => {
    class PrimitiveImpl extends Primitive {}
    Core.registerPrimitive(PrimitiveImpl);

    expect(Core.Primitive).toBe(PrimitiveImpl);
  });

  test('registerPrimitive should throw if primitive is invalid', () => {
    expect(() => Core.registerPrimitive(5)).toThrow();
  });

  test('registerPrimitive registers primitive type', () => {
    const type = { check: () => false, getClass: () => {} };
    Core.registerType(type);

    expect(Core.typeRegistry).toContain(type);
  });

  test('registerType should throw if definition is invalid', () => {
    expect(() => Core.registerType(5)).toThrow();
  });

  describe('create', () => {
    beforeAll(() => {
      Util.getFlatChildren.mockImplementation(children => children || []);
    });

    afterAll(() => {
      Util.getFlatChildren.mockRestore();
    });

    test('creates functional node if component is a function', () => {
      const fn = () => {};
      const node = Core.create(fn);
      expect(node instanceof FunctionalNode).toBe(true);
    });

    test('creates stateful node if component is a stateful node', () => {
      class TheNode extends StatefulNode {}
      const node = Core.create(TheNode);
      expect(node instanceof StatefulNode).toBe(true);
    });

    test('creates fragment if component is a fragment', () => {
      const node = Core.create(Fragment);
      expect(node instanceof Fragment).toBe(true);
    });

    test('merges children into props', () => {
      const node = Core.create(Fragment, null, '1', '2', '3');
      expect(node.props.children).toEqual([ '1', '2', '3' ]);
    });
  });
});