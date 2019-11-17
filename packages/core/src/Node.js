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

  update(props = this.props) {
    const { ref, ...otherProps } = props;
    this._ref = ref;
    this.props = otherProps;
    this.childNode = this.updateChildren(this.childNode, this.render());
  }

  forceUpdate() {
    this.update();

    const node = Util.findClosestAncestorWhere(this, node => !node.parent || node.root);
    return node.draw();
  }

  unmount() {
    Util.getFlatChildren(this.childNode).forEach(child => child && child.unmount && child.unmount());
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    const node = Util.getFlatChildren(this.childNode).map(child => child.draw());
    this._ref && this._ref(this.getRef());
    return node;
  }

  getRef() {
    return this.root || this;
  }
}