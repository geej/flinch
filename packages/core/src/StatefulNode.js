import Node from './Node';

export default class StatefulNode extends Node {
  state = {};

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.forceUpdate();
    return this.state;
  }
}
