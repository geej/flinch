import Util from './util';

export default class Node {
  update(props = this.props) {
    const { ref, ...otherProps } = props;
    this._ref = ref;
    this.props = otherProps;
    this.childNode = Util.updateNode(this, this.childNode, this.render());
  }

  forceUpdate() {
    // TODO: if forceupdate happens on an intermediate node that produces heretofore unmounted DomNodes
    // they will never be mounted, since we need to replace them on the parent Node, but the update does
    // not affect parents of the node which is forceupdated.
    //
    // I did not plan for this.

    this.update();

    // Redraw from closest mounted ancestor
    //
    // If forceupdate happens on an intermediate node that produces heretofore unmounted DomNodes
    // they will never be mounted, since we need to replace them on the parent Node, but the update does
    // not affect parents of the node which is forceupdated.
    //
    // I did not plan for this.

    let cursor = this;
    while (cursor.parent && !cursor.root) {
      cursor = cursor.parent;
    }
    return cursor.draw();
  }

  unmount() {
    this.childNode.unmount();
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