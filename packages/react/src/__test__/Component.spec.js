import Component from '../Component';
import { StatefulNode } from '@flinch/core';

describe('Component', () => {
  test('getDerivedStateFromProps should no-op by default', () => {
    const state = {};
    const result = Component.getDerivedStateFromProps(null, state);

    expect(result).toBe(state);
  });

  test('get type should return the component class', () => {
    const component = new Component();
    expect(component.type).toBe(Component);
  });

  test('setState should call setState on parent node', () => {
    const component = new Component();
    const node = new StatefulNode();
    component.flinchNode = node;
    jest.spyOn(node, 'setState');

    component.setState({});

    expect(node.setState).toHaveBeenCalled();
  });

  test('forceUpdate should call forceUpdate on parent node', () => {
    const component = new Component();
    const node = new StatefulNode();
    component.flinchNode = node;
    jest.spyOn(node, 'forceUpdate').mockReturnValue(undefined);

    component.forceUpdate();

    expect(node.forceUpdate).toHaveBeenCalled();
  });

  describe('props', () => {
    test('should get local props if flinchNode not set', () => {
      const props = { a: 1 };
      const component = new Component(props);

      expect(component.props).toEqual(props);
    });

    test('should props from flinchNode', () => {
      const props = { a: 1 };
      const component = new Component();
      const node = new StatefulNode(null, props);
      component.flinchNode = node;

      expect(component.props).toEqual(props);
    });
  });

  describe('state', () => {
    test('should get local state if flinchNode not set', () => {
      const state = { a: 1 };
      const component = new Component();
      component._state = state;
      expect(component.state).toEqual(state);
    });

    test('should get state from flinchNode', () => {
      const state = { a: 1 };
      const component = new Component();
      const node = new StatefulNode(null);
      node.state = state;
      component.flinchNode = node;

      expect(component.state).toEqual(state);
    });

    test('should set local state if flinchNode not set', () => {
      const state = { a: 1 };
      const component = new Component();
      component.state = state;
      expect(component._state).toEqual(state);
    });

    test('should set state on flinchNode', () => {
      const state = { a: 1 };
      const component = new Component();
      const node = new StatefulNode(null);
      component.flinchNode = node;
      component.state = state;

      expect(node.state).toEqual(state);
    });
  });
});