import {ForkNode, Util} from '@flinch/core';

export default class DOMNode extends ForkNode {
  _eventListeners = [];
  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.root || this.getTag(this.component);

    const { children, style, className, ...otherProps } = this.props;
    for (let key in otherProps) {
      const [, action] = /^on([a-zA-Z]+)$/.exec(key) || [];

      // Unbind old event listeners
      let listener;
      while (listener = this._eventListeners.pop()) {
        tag.removeEventListener(listener.event, listener.handler);
      }

      if (action) {
        this._eventListeners.push({ event: action.toLowerCase(), handler: otherProps[key] });
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
    // DOM Node, not Flinch Node
    } else if (node instanceof Node) {
      if (node.parentNode !== tag) {
        // TODO: Must insert in the right place
        tag.appendChild(node);
      }
    }
  }

  _drawChildren(tag) {
    Util.getFlatChildren(this.props.children).forEach(child => {
      this._recursiveAppendNode(tag, child.draw());
    });
  }
}
