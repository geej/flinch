import {Fragment, Util} from '@flinch/core';

const EVENT_REGEX = /^on([a-zA-Z]+)$/;

export default class DOMNode extends Fragment {
  _eventListeners = {};

  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.root || this.getTag(this.component);

    let { children, style, className, ...otherProps } = this.props;

    const actions = [];
    for (let key in otherProps) {
      let [, action] = EVENT_REGEX.exec(key) || [];

      if (action) {
        action = action.toLowerCase();
        actions.push(action);

        if (this._eventListeners[action] !== otherProps[key]) {
          tag.removeEventListener(action, this._eventListeners[action]);
          tag.addEventListener(action, otherProps[key]);
          this._eventListeners[action] = otherProps[key];
        }
      } else if (otherProps[key] || otherProps[key] === 0) {
        tag.setAttribute(key, otherProps[key]);
      }
    }

    Object.keys(this._eventListeners).filter(key => !actions.includes(key)).forEach((key) => {
      tag.removeEventListener(key, this._eventListeners[key]);
      delete this._eventListeners[key];
    });

    if (className) {
      tag.setAttribute("class", className);
    }

    if (style) {
      if (typeof style !== 'string') {
        style = Object.keys(style).reduce((memo, key) => {
          const value = style[key];
          const spinalKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

          return `${memo} ${spinalKey}: ${typeof value === 'number' ? `${value}px` : value};`;
        }, tag.getAttribute('style'));
      }

      tag.setAttribute('style', style);
    }

    this._drawChildren(tag);

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
    Util.getFlatChildren(this.childNode).forEach(child => {
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
