import Flinch, { StatefulNode } from "@flinch/core";

class PortalNode extends StatefulNode {
  render() {
    return this.props.children;
  }

  draw() {
    const node = this.props.children.draw();
    this.props.destination.appendChild(node);
    return node;
  }
}

export function createPortal(child, destination) {
  const node = Flinch.create(PortalNode, { destination }, child);
  child.forceUpdate();
  return node;
}
