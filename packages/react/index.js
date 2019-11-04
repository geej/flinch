import { render } from '@flinch/dom';
import { createContext } from '@flinch/context';
import Flinch from '@flinch/core';
import Component from './Component';
import Children from './Children';

const createElement = (...args) => Flinch.create(...args);
const cloneElement = (element, props) => Object.assign({}, element, { props });

// TODO
const PureComponent = Component;
const isValidElement = () => true;
const createFactory = Klass => (props, children) => Flinch.create(Klass, props, children);
const Fragment = () => { throw new Error('Not implemented'); };

const hydrate = render;
const createPortal = () => {};
const findDOMNode = vNode => vNode.root;

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
  findDOMNode,
}

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
  findDOMNode,
}