import Flinch, { Node } from '@flinch/core';

/**
 * Attaches a Flinch tree to a target DOM element.
 *
 * @param {Node} node - root node of the tree
 * @param {HTMLElement} target - element onto which to render
 */
export const render = (node, target)  => target.parentNode.replaceChild(node.update(), target);

class HTMLNode extends Node {
  draw() {
    const tag = document.createElement(this.component);
    
    const  { children, ...otherProps } = this.props;
    for (let key in otherProps) {
      const [ , action ] = /^on([a-zA-Z]+)$/.exec(key) || [];

      if (action) {
        tag.addEventListener(action.toLowerCase(), otherProps[key]);
      } else {
        tag.setAttribute(key, otherProps[key]);
      }
    }
 
    tag.appendChild(this.getResolvedChildren());
     
    return tag;
  }
  
  render() {
    return this;
  }
}

Flinch.registerType({ check: tag => typeof tag === 'string', getClass: () => HTMLNode });
