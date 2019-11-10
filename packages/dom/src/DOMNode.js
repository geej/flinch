import {ForkNode, Util} from '@flinch/core';

export default class DOMNode extends ForkNode {
  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.getTag(this.component);

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

    tag.appendChild(this._drawChildren());

    tag.node = this;

    // Need to redraw on state change
    this.root && this.root.parentNode && this.root.parentNode.replaceChild(tag, this.root);
    this.root = tag;
    this._ref && this._ref(tag);
    return tag;
  }

  _recursiveAppendNode(fragment, node) {
    if (Array.isArray(node)) {
      node.forEach(child => this._recursiveAppendNode(fragment, child));
    } else if (node instanceof Element) {
      fragment.appendChild(node);
    } else if (node || node === 0) {
      fragment.appendChild(document.createTextNode(node));
    }
  }

  _drawChildren() {
    const fragment = document.createDocumentFragment();

    Util.getFlatChildren(this.props.children).forEach(child => {
      this._recursiveAppendNode(fragment, Util.drawNode(child));
    });

    return fragment;
  }
}
