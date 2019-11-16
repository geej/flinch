import Node from './Node';

export default class ForkNode extends Node {
  constructor(props) {
    super();
    this.childNode = props && props.children;
  }

  render() {
    return this.props.children;
  }
}
