import Flinch, { StatefulNode } from '@flinch/core';

class PortalNode extends StatefulNode {
  // update() {
  //   this.props.children[0].update();
  // }

  render() {
    return this.props.children[0];
  }

  replaceRoot(node) {
    if (!this.props.destination) { return; }

    this.props.destination.innerHTML = '';
    this.props.destination.appendChild(node);
    this.root = node;
    return this.root;
  }
}


export function createPortal(child, container) {
  const node = Flinch.create(PortalNode, { destination: container }, child);
  node.update();
  
  return undefined;
}