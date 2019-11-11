import Util from './util';

export default class Node {
  update(props = this.props) {
    const { ref, ...otherProps } = props;
    this._ref = ref;
    this.props = otherProps;
    this.childNode = Util.updateNode(this, this.childNode, this.render());
  }

  forceUpdate() {
    this.update();
    return this.draw();
  }

  unmount() {
    this.childNode.unmount();
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    const node = this.childNode.draw();
    this._ref && this._ref(this.root || this);
    return node;
  }
}