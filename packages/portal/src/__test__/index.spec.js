import PortalNode from '..';
import HTMLNode from '@flinch/dom/dist/HTMLNode';
import '@flinch/dom';
import Flinch from '@flinch/core';

describe('portal', () => {
  test('registers flinch type', () => {
    const node = Flinch.create(PortalNode);
    expect(node instanceof PortalNode).toBe(true);
  });

  test('portal node should draw to target idempotently', () => {
    const target = document.createElement('div');
    const innerNode = new HTMLNode('div');
    const node = new PortalNode(null, { destination: target, children: innerNode });
    node.update();
    node.draw();

    expect(target.childNodes[0] instanceof HTMLElement).toBe(true);

    node.draw();
    expect(target.childNodes.length).toBe(1);
  });

  test('portal should delete mountpoint on unmount', () => {
    const target = document.createElement('div');
    const innerNode = new HTMLNode('div');
    const node = new PortalNode(null, { destination: target, children: innerNode });
    node.update();
    node.draw();

    expect(target.childNodes.length).toBe(1);

    node.unmount();

    expect(target.childNodes.length).toBe(0);
  });

  test('portal should not error on unmount if not mounted', () => {
    const target = document.createElement('div');
    const innerNode = new HTMLNode('div');
    const node = new PortalNode(null, { destination: target, children: innerNode });
    node.update();

    expect(target.childNodes.length).toBe(0);

    node.unmount();

    expect(target.childNodes.length).toBe(0);
  });
});