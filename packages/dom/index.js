import Flinch, { ForkNode } from "@flinch/core";
import { SVG_TAGS, HTML_TAGS } from './constants';

/**
 * Attaches a Flinch tree to a target DOM element.
 *
 * @param {Node} node - root node of the tree
 * @param {HTMLElement} target - element onto which to render
 */
export const render = (node, target) =>
  target.parentNode.replaceChild(node.update(), target);

class DOMNode extends ForkNode {
  getTag() { throw new Error('getTag must be extended'); }

  draw() {
    const tag = this.getTag(this.component);

    const { children, className, ...otherProps } = this.props;
    for (let key in otherProps) {
      const [, action] = /^on([a-zA-Z]+)$/.exec(key) || [];

      if (action) {
        tag.addEventListener(action.toLowerCase(), otherProps[key]);
      } else if (otherProps[key] !== undefined) {
        tag.setAttribute(key, otherProps[key]);
      }
    }

    if (className) {
      tag.setAttribute("class", className);
    }

    tag.appendChild(this.getResolvedChildren());

    return tag;
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
