import Node from './Node';

export default class Fragment extends Node {
  render() {
    return this.props.children;
  }
}
