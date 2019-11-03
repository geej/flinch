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
const createFactory = () => {};

const hydrate = render;
const createPortal = () => {};

export {
  //React
  Component,
  PureComponent,
  createContext,
  // Fragment,
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
  Children,

  // ReactDOM
  render,
  hydrate,
  createPortal
}