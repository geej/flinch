import Node from './Node';

export default class ForkNode extends Node {
  constructor(component, props) {
    super(component, props);
    this.childNode = props && props.children;
  }

  render() {
    return this.props.children;
  }
}
