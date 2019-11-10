import {ForkNode, Util} from '@flinch/core';

export default class DOMNode extends ForkNode {
  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.root || this.getTag(this.component);

    const { children, style, className, ...otherProps } = this.props;
    for (let key in otherProps) {
      const [, action] = /^on([a-zA-Z]+)$/.exec(key) || [];

      if (action) {
        tag.addEventListener(action.toLowerCase(), otherProps[key]);
      } else if (otherProps[key] || otherProps[key] === 0) {
        tag.setAttribute(key, otherProps[key]);
      }
    }

    if (className) {
      tag.setAttribute("class", className);
    }

    if (style) {
      if (typeof style === 'string') {
        tag.setAttribute('style', style);
      } else {
        for (let i in style) {
          tag.style[i] = style[i];
        }
      }
    }

    this._drawChildren(tag);

    this.root = tag;
    this._ref && this._ref(tag);
    return tag;
  }

  _recursiveAppendNode(tag, node) {
    if (Array.isArray(node)) {
      node.forEach(child => this._recursiveAppendNode(tag, child));
    } else if (node instanceof Element) {
      if (node.parentNode !== tag) {
        // TODO: Must insert in the right place
        tag.appendChild(node);
      }
    } else if (node || node === 0) {
      // TODO: Must insert in the right place... also how are we going to detect these are the same?
      tag.appendChild(document.createTextNode(node));
    }
  }

  _drawChildren(tag) {
    Util.getFlatChildren(this.props.children).forEach(child => {
      this._recursiveAppendNode(tag, Util.drawNode(child));
    });
  }
}
