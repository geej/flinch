import HTMLNode from '../HTMLNode';

describe('HTMLNode', () => {
  test('should draw HTMLElement', () => {
    const node = new HTMLNode('div');
    const result = node.draw();

    expect(result instanceof HTMLElement).toBe(true);
  });
});