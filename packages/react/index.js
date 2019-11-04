import { render } from '@flinch/dom';
import { createContext } from '@flinch/context';
import { createPortal } from '@flinch/portals';
import Flinch from '@flinch/core';
import Component from './Component';
import Children from './Children';

const createElement = (...args) => Flinch.create(...args);
const cloneElement = (element, props) => Object.assign({}, element, { props });
const createFactory = Klass => (props, children) => Flinch.create(Klass, props, children);

const findDOMNode = vNode => vNode.root;

// TODO
const PureComponent = Component;
const isValidElement = () => true;
const Fragment = () => { throw new Error('Not implemented'); };

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