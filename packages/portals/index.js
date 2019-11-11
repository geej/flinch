import Flinch, { ForkNode } from '@flinch/core';

const portalMap = new Map();

class PortalNode extends ForkNode {
  draw() {
    const node = this.props.children.draw();
    if (!this.mountPoint) {
      this.props.destination.appendChild(node);
    }
    this.mountPoint = node;
  }

  unmount() {
    if (this.mountPoint) {
      this.props.destination.removeChild(this.mountPoint);
    }
  }
}

export function createPortal(child, destination) {
  return Flinch.create(PortalNode, { destination }, child);
}

Flinch.registerType({ check: klass => klass === PortalNode, getClass: () => PortalNode });