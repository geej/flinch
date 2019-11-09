import { ForkNode, Util } from '@flinch/core';

class Fragment extends ForkNode {
  draw(children) {
    children = Array.isArray(children) ? children : [children];
    const fragment = document.createDocumentFragment();

    children.map(child => {
      if (child) {
        fragment.appendChild(child);
      }
    });

    return fragment;
  }

  render() {
    return this;
  }
}
