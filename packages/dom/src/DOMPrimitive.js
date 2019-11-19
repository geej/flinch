import { Primitive } from '@flinch/core';

export default class DOMPrimitive extends Primitive {
  draw() {
    if (this.root) {
      this.root.nodeValue = this.value;
    } else {
      this.root = document.createTextNode(this.value);
    }

    return this.root;
  }
}