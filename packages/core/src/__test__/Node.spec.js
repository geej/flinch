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
import Node from '../Node';

describe('Node', () => {
  test('constructor should set props and component', () => {
    const component = () => {};
    const props = {};
    const node = new Node(component, props);

    expect(node.component).toBe(component);
    expect(node.props).toBe(props);
  });

  test('render should throw', () => {
    const node = new Node(() => {});
    expect(() => node.render()).toThrow();
  });

  test('this.ref should return self', () => {
    const node = new Node(() => {});
    expect(node.ref).toBe(node);
  });

  test('unmount should call unmount on all children', () => {
    const node = new Node(() => {});
    const child1 = new Node(() => {});
    const child2 = new Node(() => {});

    jest.spyOn(child1, 'unmount');
    jest.spyOn(child2, 'unmount');

    Util.getFlatChildren.mockReturnValueOnce([ null, 'a', child1, child2 ]);
    Util.getFlatChildren.mockReturnValue([]);

    node.unmount();

    expect(child1.unmount).toHaveBeenCalled();
    expect(child2.unmount).toHaveBeenCalled();
  });

  test('draw should call draw on children', () => {
    const node = new Node(() => {});
    const child1 = new Node(() => {});
    const child2 = new Node(() => {});

    jest.spyOn(child1, 'draw').mockReturnValue('a');
    jest.spyOn(child2, 'draw').mockReturnValue('b');

    Util.getFlatChildren.mockReturnValueOnce([ child1, child2 ]);
    Util.getFlatChildren.mockReturnValue([]);

    const result = node.draw();

    expect(child1.draw).toHaveBeenCalled();
    expect(child2.draw).toHaveBeenCalled();

    expect(result).toEqual(['a', 'b']);
  });

  test('draw should set ref', () => {
    const node = new Node(() => {});
    Util.getFlatChildren.mockReturnValueOnce([]);
    node._handleRef = jest.fn();

    node.draw();

    expect(node._handleRef).toHaveBeenCalledWith(node);
  });

  describe('forceUpdate', () => {
    let node;
    let ancestor;

    beforeEach(() => {
      node = new Node(() => {});
      ancestor = new Node(() => {});

      jest.spyOn(ancestor, 'draw').mockReturnValue(null);
      jest.spyOn(node, 'update').mockReturnValue(null);

      Util.findClosestAncestorWhere.mockReturnValue(ancestor);
    });

    test('should call update', () => {
      node.forceUpdate();
      expect(node.update).toHaveBeenCalled();
    });

    test('should call draw on nearest ancestor', () => {
      node.forceUpdate();
      expect(ancestor.draw).toHaveBeenCalled();
    });

    test('should call update', () => {
      const callback = jest.fn();
      node.forceUpdate(callback);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    let TestNode;
    let renderNode;

    beforeEach(() => {
      Util.updateNode.mockImplementation((a, b, c) => c);
      renderNode = new Node();
      TestNode = class extends Node {
        render() {
          return renderNode;
        }
      }
    });

    afterEach(() => {
      Util.updateNode.mockRestore();
    });

    test('should update childNode with result from render', () => {
      const node = new TestNode();
      node.update();
      expect(node.childNode).toBe(renderNode);
    });

    test('should set handleRef if provided', () => {
      const ref = jest.fn();
      const node = new TestNode(null, { ref });
      node.update();
      expect(node._handleRef).toBe(ref);
    });

    test('should set props except ref', () => {
      const node = new TestNode(null, { ref: () => {}, a: 1, b: 2 });
      node.update();
      expect(node.props).toEqual({ a: 1, b: 2 });
    });

    test('should recursively call update children if children is an array', () => {
      class TestNode2 extends Node {
        render() {
          return [renderNode, [renderNode, renderNode, [renderNode]]];
        }
      }

      const node = new TestNode2();
      node.update();

      expect(Util.updateNode).toHaveBeenCalledTimes(4);
    });

    test('should call updateNode against oldChild in same position', () => {
      const oldNode = new Node();
      class TestNode2 extends Node {
        render() {
          return [renderNode];
        }
      }

      const node = new TestNode2();
      node.childNode = [oldNode];
      node.update();

      expect(Util.updateNode).toHaveBeenCalledWith(node, oldNode, renderNode);
    });
  });
});
