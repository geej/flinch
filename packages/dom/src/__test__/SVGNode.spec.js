import SVGNode from '../SVGNode';

describe('SVGNode', () => {
  test('should draw SVGElement', () => {
    const node = new SVGNode('rect');
    const result = node.draw();

    expect(result instanceof SVGElement).toBe(true);
  });
});