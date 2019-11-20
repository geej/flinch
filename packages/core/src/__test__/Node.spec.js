jest.mock('../util', () => ({
  updateNode: jest.fn(),
  findClosestAncestorWhere: jest.fn(),
  getFlatChildren: jest.fn()
}));

import * as Util from '../util';
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

  test('getRef should return self', () => {
    const node = new Node(() => {});
    expect(node.getRef()).toBe(node);
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
});
