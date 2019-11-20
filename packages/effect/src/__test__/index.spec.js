import effect from '..';
import { StatefulNode } from '@flinch/core';

describe('@effect', () => {
  beforeAll(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterAll(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('@effect should return a decorator if first arg is not a node', () => {
    const result = effect(() => []);
    expect(typeof result).toEqual('function');
  });

  test('should fire on mount if no function provided', () => {
    const mock = jest.fn();
    class TestNode extends StatefulNode {
      @effect() handleEffect() {
        mock();
      }
      render() {}
    }

    const node = new TestNode(TestNode);

    node.update();
    node.update();
    node.update();

    expect(mock).toHaveBeenCalledTimes(1);
  });

  test('should fire on all updates in simple mode', () => {
    const mock = jest.fn();
    class TestNode extends StatefulNode {
      @effect handleEffect() {
        mock();
      }
      render() {}
    }

    const node = new TestNode(TestNode);

    node.update();
    node.update();
    node.update();

    expect(mock).toHaveBeenCalledTimes(3);
  });

  test('should fire prop changes', () => {
    const mock = jest.fn();
    class TestNode extends StatefulNode {
      @effect(props => [ props.a ]) handleEffect() {
        mock();
      }
      render() {}
    }

    const node = new TestNode(TestNode, {});


    node.update();
    node.update({ a: 1 });
    node.update({ a: 1 });

    expect(mock).toHaveBeenCalledTimes(2);
  });
});