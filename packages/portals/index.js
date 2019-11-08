import Flinch, { StatefulNode } from "@flinch/core";

const portalMap = new Map();

class PortalNode extends StatefulNode {
  render() {
    return this.props.children;
  }

  draw() {
    const node = this.props.children.draw();
    const portal = portalMap.get(this.props.destination);

    if (portal) {
      this.props.destination.replaceChild(node, portal);
    } else {
      this.props.destination.appendChild(node);
    }
    return node;
  }
}

export function createPortal(child, destination) {
  const portal = portalMap.get(destination);
  if (portal) {
    destination.removeChild(portal);
  }

  const node = Flinch.create(PortalNode, { destination }, child);

  child.forceUpdate();
  return node;
}
