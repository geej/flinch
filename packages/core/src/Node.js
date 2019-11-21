import Util from './util';

export default class Node {
  constructor(component, props) {
    this.props = props;
    this.component = component;
  }

  updateChildren(oldChild, newChild) {
    if (Array.isArray(newChild)) {
      return newChild.map((child, index) => this.updateChildren(oldChild && oldChild[index], child));
    } else {
      return Util.updateNode(this, oldChild, newChild);
    }
  }

  update({ ref, ...props } = this.props || {}) {
    if (ref) this._handleRef = ref;
    this.props = props;
    this.childNode = this.updateChildren(this.childNode, this.render());
  }

  forceUpdate(callback = () => null) {
    this.update();

    const node = Util.findClosestAncestorWhere(this, node => !node.parent || node.root);
    const dom = node.draw();

    callback();

    return dom;
  }

  unmount() {
    Util.getFlatChildren(this.childNode).forEach(child => child && child.unmount && child.unmount());
  }

  render() {
    throw new Error('render must be defined by a child class!');
  }

  draw() {
    const node = Util.getFlatChildren(this.childNode).map(child => child.draw());
    if (this._handleRef) this._handleRef(this.ref);
    return node;
  }

  get ref() {
    return this;
  }
}
