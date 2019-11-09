import Flinch, { ForkNode, Util } from "@flinch/core";
import { SVG_TAGS, HTML_TAGS } from './constants';

/**
 * Attaches a Flinch tree to a target DOM element.
 *
 * @param {Node} node - root node of the tree
 * @param {HTMLElement} target - element onto which to render
 */
export const render = (node, target) =>
  target.parentNode.replaceChild(node.forceUpdate(), target);

class DOMNode extends ForkNode {
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

    tag.appendChild(this.drawChildren());

    tag.node = this;
    this.root = tag;
    this._ref && this._ref(tag);
    return tag;
  }

  drawChildren() {
    const fragment = document.createDocumentFragment();
    Util.getFlatChildren(this.props.children).forEach(child => {
      const node = Util.drawNode(child);

      if (Util.shouldDrawNode(node)) {
        fragment.appendChild(node);
      }
    });

    return fragment;
  }

  render() {
    return this;
  }
}

class HTMLNode extends DOMNode {
  getTag(tag) {
    return document.createElement(tag);
  }
}

class SVGNode extends DOMNode {
  getTag(tag) {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      tag
    );
  }
}

Flinch.registerType({
  check: tag => typeof tag === "string" && HTML_TAGS.includes(tag),
  getClass: () => HTMLNode
});

Flinch.registerType({
  check: tag => typeof tag === "string" && SVG_TAGS.includes(tag),
  getClass: () => SVGNode
});
