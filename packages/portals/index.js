import Flinch, { Node } from '@flinch/core';

export default class PortalNode extends Node {
  render() {
    return this.props.children;
  }

  draw() {
    const node = this.childNode.draw();
    if (!this.mountPoint) {
      this.props.destination.appendChild(node);
    }
    this.mountPoint = node;
  }

  unmount() {
    super.unmount();

    if (this.mountPoint) {
      this.props.destination.removeChild(this.mountPoint);
    }
  }
}

Flinch.registerType({ check: klass => klass === PortalNode, getClass: () => PortalNode });