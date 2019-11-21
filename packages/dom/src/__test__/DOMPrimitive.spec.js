import DOMPrimitive from '../DOMPrimitive';

describe('DOMPrimitive', () => {
  test('should create text node for value', () => {
    const node = new DOMPrimitive('value');
    const result = node.draw();

    expect(result instanceof Text).toBe(true);
    expect(result.nodeValue).toEqual('value');
  });

  test('should update text node if value has changes', () => {
    const node = new DOMPrimitive('value');
    const result1 = node.draw();
    node.update('newValue');
    const result2 = node.draw();

    expect(result1).toBe(result2);
    expect(result1.nodeValue).toEqual('newValue');
  });
});