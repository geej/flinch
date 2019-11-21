import observer from '..';
import Flinch, { StatefulNode } from '@flinch/core';
import '@flinch/dom';
import { observable } from 'mobx';

@observer
class TestNode extends StatefulNode {
  @observable clicked = 0;

  render() {
    return (
      <div onClick={() => (this.clicked = this.clicked + 1)} />
    );
  }
}

describe('@flinch/mobx', () => {
  beforeAll(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0));
  });

  afterAll(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('triggers update on observable change', () => {
    jest.useFakeTimers();
    const node = new TestNode(TestNode, {});
    const dom = node.forceUpdate()[0][0];
    jest.runAllTimers();
    const spy = jest.spyOn(node.childNode, 'update');

    dom.dispatchEvent(new MouseEvent('click'));
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);

    dom.dispatchEvent(new MouseEvent('click'));
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});