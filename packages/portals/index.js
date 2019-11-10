import Flinch, { ForkNode } from '@flinch/core';

const portalMap = new Map();

class PortalNode extends ForkNode {
  draw() {
    const node = portalMap.get(this.props.destination);
    if (!node) {
      this.props.destination.appendChild(this.props.children.draw());
    }
    portalMap.set(this.props.destination, node);
  }
}

export function createPortal(child, destination) {
  return Flinch.create(PortalNode, { destination }, child);
}

Flinch.registerType({ check: klass => klass === PortalNode, getClass: () => PortalNode });