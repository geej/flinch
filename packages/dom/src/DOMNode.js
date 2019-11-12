import {ForkNode, Util} from '@flinch/core';

export default class DOMNode extends ForkNode {
  _eventListeners = [];
  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.root || this.getTag(this.component);

    let { children, style, className, ...otherProps } = this.props;

    // Unbind old event listeners
    let listener;
    while (listener = this._eventListeners.pop()) {
      tag.removeEventListener(listener.event, listener.handler);
    }

    for (let key in otherProps) {
      let [, action] = /^on([a-zA-Z]+)$/.exec(key) || [];

      if (action) {
        action = action.toLowerCase();
        this._eventListeners.push({ event: action, handler: otherProps[key] });
        tag.addEventListener(action, otherProps[key]);
      } else if (otherProps[key] || otherProps[key] === 0) {
        tag.setAttribute(key, otherProps[key]);
      }
    }

    if (className) {
      tag.setAttribute("class", className);
    }

    if (style) {
      if (typeof style !== 'string') {
        style = Object.keys(style).reduce((memo, key) => {
          const value = style[key];
          const spinalKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

          return `${memo} ${spinalKey}: ${typeof value === 'number' ? `${value}px` : value};`;
        }, '');
      }

      tag.setAttribute('style', style);
    }

    this._drawChildren(tag);

    tag.node = this;
    this.root = tag;
    this._ref && this._ref(tag);
    return tag;
  }

  _recursiveGetNodes(array, node) {
    if (Array.isArray(node)) {
      node.forEach(child => this._recursiveGetNodes(array, child));
    } else {
      array.push(node);
    }
  }
  _drawChildren(tag) {
    const newNodes = [];
    Util.getFlatChildren(this.props.children).forEach(child => {
      this._recursiveGetNodes(newNodes, child.draw());
    });

    const childNodes = Array.from(tag.childNodes);

    childNodes.forEach(node => {
      if (newNodes.indexOf(node) === -1) {
        tag.removeChild(node);
      }
    });

    newNodes.reverse().forEach((node, index, nodes) => {
      if (node && childNodes.indexOf(node) === -1) {
        tag.insertBefore(node, nodes[index - 1]);
      }
    });
  }
}
