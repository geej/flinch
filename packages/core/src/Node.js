import Util from './util';

export default class Node {
  update(props = this.props) {
    const { ref, ...otherProps } = props;
    ref && ref(this.root || this);

    this.props = otherProps;
    this.childNode = Util.updateNode(this, this.childNode, this.render());
  }

  forceUpdate() {
    this.update();
    return this.draw();
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    return Util.drawNode(this.childNode);
  }
}