import DOMNode from './DOMNode';

export default class SVGNode extends DOMNode {
  getTag(tag) {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      tag
    );
  }
}
