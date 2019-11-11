import Flinch, { ForkNode } from '@flinch/core';

const portalMap = new Map();

class PortalNode extends ForkNode {
  draw() {
    const node = portalMap.get(this.props.destination);
    const newNode = this.props.children.draw();
    if (!node) {
      this.props.destination.appendChild(newNode);
    }
    portalMap.set(this.props.destination, newNode);
  }

  unmount() {
    const node = portalMap.get(this.props.destination);

    if (node) {
      this.props.destination.removeChild(node);
      portalMap.delete(this.props.destination);
    }
  }
}

export function createPortal(child, destination) {
  return Flinch.create(PortalNode, { destination }, child);
}

Flinch.registerType({ check: klass => klass === PortalNode, getClass: () => PortalNode });