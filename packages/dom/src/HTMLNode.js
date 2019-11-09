import DOMNode from './DOMNode';

export default class HTMLNode extends DOMNode {
  getTag(tag) {
    return document.createElement(tag);
  }
}
