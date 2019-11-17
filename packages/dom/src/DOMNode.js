import {Fragment, Util} from '@flinch/core';

const EVENT_REGEX = /^on([a-zA-Z]+)$/;
const REQUIRES_UNIT_REGEX = /(top|bottom|left|right|width|height)$/i;

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
      tag.setAttribute('class', className);
    }

    if (style) {
      if (this._styleKeys) {
        this._styleKeys.forEach(key => delete tag.style[key])
      }

      Object.keys(style).forEach(key => {
        let value = style[key];
        if (REQUIRES_UNIT_REGEX.test(key) && typeof value === 'number') {
          value = `${value}px`;
        }
        tag.style[key] = value;
      });

      this._styleKeys = Object.keys(style);
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
