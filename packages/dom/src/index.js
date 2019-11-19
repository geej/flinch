import Flinch from '@flinch/core';
import { HTML_TAGS, SVG_TAGS } from './util/constants';
import HTMLNode from './HTMLNode';
import SVGNode from './SVGNode';
import DOMPrimitive from './DOMPrimitive';
/**
 * Attaches a Flinch tree to a target DOM element.
 *
 * @param {Node} node - root node of the tree
 * @param {HTMLElement} target - element onto which to render
 */
export default function(node, target) {
  return target.parentNode.replaceChild(node.forceUpdate(), target);
}

Flinch.registerType({
  check: tag => typeof tag === 'string' && HTML_TAGS.includes(tag),
  getClass: () => HTMLNode
});

Flinch.registerType({
  check: tag => typeof tag === 'string' && SVG_TAGS.includes(tag),
  getClass: () => SVGNode
});

Flinch.registerPrimitive(DOMPrimitive);
