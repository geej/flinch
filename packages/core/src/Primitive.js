export default class Primitive {
  constructor(value) {
    this.update(value);
  }

  update(value) {
    this.value = value || value === 0 ? value : '';
  }

  draw() {
    throw new Error('draw() must be implemented by a child class');
  }
}
