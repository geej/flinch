import Node from './Node';
import Util from './util';

export default class ForkNode extends Node {
  updateChildren(oldChild, newChild) {
    if (Array.isArray(newChild)) {
      return newChild.map((child, index) => this.updateChildren(oldChild[index], child));
    } else {
      return Util.updateNode(this, oldChild, newChild);
    }
  }

  update(props = this.props) {
    const { ref, ...otherProps } = props;
    this._ref = ref;
    this.props = { ...otherProps, children: this.updateChildren(this.props.children, props.children) };
  }

  render() {
    return this;
  }
}
