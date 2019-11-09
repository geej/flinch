import { render } from "@flinch/dom";
import { createContext } from "@flinch/context";
import { createPortal } from "@flinch/portals";
import Flinch, { Node } from "@flinch/core";
import "@flinch/props-defaults";
import Component from "./Component";
import Children from "./Children";

const createElement = (...args) => Flinch.create(...args);
const cloneElement = (element, props, children) => Object.assign(Object.create(Object.getPrototypeOf(element)), element, { props: { ...element.props, ...props, children: children || props.children || (element.props && element.props.children) }});
const createFactory = Klass => (props, children) =>
  Flinch.create(Klass, props, ...(children || []));

const findDOMNode = node => {
  while (node && !node.root) {
    node = node.childNode;
  }

  return node && node.root;
};

// TODO
const PureComponent = Component;
const isValidElement = element => element instanceof Node;
class Fragment extends Component {
  render() {
    return this.props.children[0];
  }
}

Flinch.registerType({ check: tag => tag === Fragment, getClass: () => Fragment });
Event.prototype.persist = () => {};

const hydrate = render;

export default {
  Component,
  PureComponent,
  createContext,
  Fragment,
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
  Children,
  render,
  hydrate,
  createPortal,
  findDOMNode
};

export {
  // React
  Component,
  PureComponent,
  createContext,
  Fragment,
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
  Children,
  // ReactDOM
  render,
  hydrate,
  createPortal,
  findDOMNode
};
