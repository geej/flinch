import { render } from "@flinch/dom";
import { createContext } from "@flinch/context";
import { createPortal } from "@flinch/portals";
import Flinch from "@flinch/core";
import Fragment from '@flinch/fragment';
import "@flinch/props-defaults";
import Component from "./Component";
import Children from "./Children";

const createElement = (...args) => Flinch.create(...args);
const cloneElement = (element, props, children) => Object.assign(Object.create(Object.getPrototypeOf(element)), element, { props: { ...element.props, ...props, children: children || props.children || (element.props && element.props.children) }});
const createFactory = Klass => (props, children) =>
  Flinch.create(Klass, props, ...(children || []));

/*
  Find the closest child that is a DOMNode. If that node is mounted, return the mounted Element.
 */
const findDOMNode = node => {
  while (node && !node.root) {
    node = node.childNode;
  }

  return node && node.root;
};

/*
  A PureComponent is just a Component with a stricter shouldComponentUpdate function.
  TODO: We can implement this at any time.
 */
const PureComponent = Component;

/*
  Is the element a Flinch node?
 */
const isValidElement = element => element instanceof Node;

/*
  Synthetic events have a function to halt recycling. Since we're not using synthetic
  events, we need to patch a no-op function into the native Event prototype.
 */
Event.prototype.persist = () => {};

/*
  ReactDOM.hydrate is the same as render, but tries to use the dom nodes that already exist
  in the target Element. We can skip this for now with no adverse effects.
  TODO: We can implement this at any time
 */
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
