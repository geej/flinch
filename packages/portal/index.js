import Flinch, { Fragment } from '@flinch/core';

export default class PortalNode extends Fragment {
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