import Util from './util';

export default class Node {
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
    this.props = otherProps;
    this.childNode = this.updateChildren(this.childNode, this.render());
  }

  forceUpdate() {
    this.update();

    // Redraw from closest mounted ancestor
    let cursor = this;
    while (cursor.parent && !cursor.root) {
      cursor = cursor.parent;
    }
    return cursor.draw();
  }

  unmount() {
    Util.getFlatChildren(this.childNode).forEach(child => child && child.unmount && child.unmount());
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    const node = this.childNode.draw();
    this._ref && this._ref(this.getRef());
    return node;
  }

  getRef() {
    return this.root || this;
  }
}