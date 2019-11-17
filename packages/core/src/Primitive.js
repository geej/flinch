export default class Primitive {
  constructor(value) {
    this.update(value);
  }

  update(value) {
    this.value = value || value === 0 ? value : '';
  }

  draw() {
    if (this.root) {
      this.root.nodeValue = this.value;
    } else {
      this.root = document.createTextNode(this.value);
    }

    return this.root;
  }
}
