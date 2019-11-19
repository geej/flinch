import Node from './Node';

export default class StatefulNode extends Node {
  state = {};

  setState(state, callback = () => {}) {
    requestAnimationFrame(() => {
      const newState = typeof state === 'function' ? state(this.state) : state;
      this.state = { ...this.state, ...newState };
      this.forceUpdate(() => callback());
    });
  }
}
