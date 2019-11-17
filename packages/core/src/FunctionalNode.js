import Node from './Node';

export default class FunctionalNode extends Node {
  render() {
    return this.component(this.props);
  }
}
