import Flinch, { StatefulNode } from "@flinch/core";

class PortalNode extends StatefulNode {
  render() {
    return this.props.children;
  }

  draw() {
    return this.replaceRoot(this.props.children.draw());
  }

  replaceRoot(node) {
    if (!this.props.destination) {
      return;
    }

    this.props.destination.innerHTML = "";
    this.props.destination.appendChild(node);
    this.root = node;
    return this.root;
  }
}

export function createPortal(child, destination) {
  const node = Flinch.create(PortalNode, { destination }, child);
  node.forceUpdate();
}
