import Flinch, { Node } from '@flinch/core';

export const render = (element, target)  => target.parentNode.replaceChild(element.update(), target);

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
