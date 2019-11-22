import React from '..';
import Flinch from '@flinch/core';
import HTMLNode from '@flinch/dom/dist/HTMLNode';
import PortalNode from '@flinch/portal';
import ReactNode from '../ReactNode';
import Component from '../Component';

describe('@flinch/react', () => {
  test('createElement should call Flinch.create', () => {
    jest.spyOn(Flinch, 'create');

    React.createElement('div', { a: 1 }, []);

    expect(Flinch.create).toHaveBeenCalledWith('div', { a: 1 }, []);
  });

  describe('cloneElement', () => {
    test('should shallow clone element', () => {
      const element = React.createElement('div', { a: 1 }, []);
      const clone = React.cloneElement(element);

      expect(clone instanceof HTMLNode).toBe(true);
      expect(clone.props).toEqual({ a: 1 });
      expect(clone).not.toBe(element);
    });
  });

  test('createFactory should return a function that calls Flinch.create', () => {
    jest.spyOn(Flinch, 'create');

    const Div = React.createFactory('div');
    Div({ a: 1 }, []);

    expect(Flinch.create).toHaveBeenCalledWith('div', { a: 1 }, []);
  });

  describe('isValidElement', () => {
    test('should return true for any valid node', () => {
      expect(React.isValidElement(new HTMLNode())).toBe(true);
    });

    test('should return false on dom elements', () => {
      expect(React.isValidElement(document.createElement('div'))).toBe(false);
    });

    test('should return false on primitives', () => {
      expect(React.isValidElement(1)).toBe(false);
    });
  });

  test('createPortal should return a portal node', () => {
    const portal = React.createPortal(React.createElement('div'), document.createElement('div'));
    expect(portal instanceof PortalNode).toBe(true);
  });

  describe('findDOMNode', () => {
    test('should return own root if it exists', () => {
      const node = new HTMLNode('div');
      node.root = document.createElement('div');

      expect(React.findDOMNode(node)).toBe(node.root);
    });

    test('should find nearest single childNode with a root', () => {
      const node = new HTMLNode('div');
      const child1 = new HTMLNode('div');
      const child2 = new HTMLNode('div');

      node.childNode = child1;
      child1.childNode = child2;
      child2.root = document.createElement('div');

      expect(React.findDOMNode(node)).toBe(child2.root);
    });

    test('should return null if no single childNode has a root', () => {
      const node = new HTMLNode('div');
      const child1 = new HTMLNode('div');
      const child2 = new HTMLNode('div');

      node.childNode = child1;
      child1.childNode = child2;
      child2.childNode = [];

      expect(React.findDOMNode(node)).toBe(undefined);
    });

    test('should be able to handle react components', () => {
      const component = new Component();
      const node = new ReactNode();
      component.flinchNode = node;
      const child1 = new HTMLNode('div');
      const child2 = new HTMLNode('div');

      node.childNode = child1;
      child1.childNode = child2;
      child2.root = document.createElement('div');

      expect(React.findDOMNode(component)).toBe(child2.root);
    });
  });

  test('flinch should be able to register components as ReactNodes', () => {
    class TestComponent extends Component {}
    const result = Flinch.create(TestComponent);
    expect(result instanceof ReactNode).toBe(true);
  });
});