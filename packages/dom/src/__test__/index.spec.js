import render from '..';
import Flinch from '@flinch/core';
import DOMPrimitive from '../DOMPrimitive';
import HTMLNode from '../HTMLNode';
import SVGNode from '../SVGNode';

describe('@flinch/dom', () => {
  test('should register DOMPrimitive with framework', () => {
    expect(Flinch.Primitive).toBe(DOMPrimitive);
  });

  test('should add HTML type', () => {
    const result = Flinch.create('div');
    expect(result instanceof HTMLNode).toBe(true);
  });

  test('should add SVG type', () => {
    const result = Flinch.create('rect');
    expect(result instanceof SVGNode).toBe(true);
  });

  test('render should mount to target', () => {
    const target = document.createElement('div');
    expect(target.childNodes.length).toBe(0);

    const node = Flinch.create('div');
    render(node, target);

    expect(target.childNodes.length).toBe(1);
  });

  test('on second render, should replace the original node', () => {
    const target = document.createElement('div');
    const node = Flinch.create('div');

    render(node, target);
    const firstChild = target.childNodes[0];
    render(node, target);

    expect(firstChild).not.toBe(target.childNodes[0]);
  });
});