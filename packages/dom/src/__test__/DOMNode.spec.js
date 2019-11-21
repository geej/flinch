import '..';
import DOMNode from '../DOMNode';

describe('DOMNode', () => {
  test('should throw on draw if getTag is not set on base class', () => {
    const node = new DOMNode('div');
    node.update();
    expect(() => node.draw()).toThrow();
  });
  describe('draw', () => {
    class TestNode extends DOMNode {
      getTag(name) {
        return document.createElement(name);
      }
    }

    test('className sets class attribute on element', () => {
      const node = new TestNode('div', { className: 'myClassName' });
      const result = node.draw();
      expect(result.getAttribute('class')).toEqual('myClassName');
    });

    test('style should set styles on element', () => {
      const node = new TestNode('div', { style: { position: 'absolute' } });
      const result = node.draw();
      expect(result.style.position).toEqual('absolute');
    });

    test('style mutation should remove stale styles', () => {
      const node = new TestNode('div', { style: { position: 'absolute' } });
      const result = node.draw();
      expect(result.style.position).toEqual('absolute');

      node.update({ style: { color: 'red' } });
      node.draw();
      expect(result.style.position).toEqual('');
      expect(result.style.color).toEqual('red');
    });

    test('style should coerce numbers to px where appropriate', () => {
      const node = new TestNode('div', { style: { height: 1 } });
      const result = node.draw();
      expect(result.style.height).toEqual('1px');
    });

    test('should set eventlistener on tag', () => {
      const onClick = jest.fn();
      const node = new TestNode('div', { onClick });
      const result = node.draw();
      result.dispatchEvent(new MouseEvent('click'));
      expect(onClick).toHaveBeenCalled();
    });

    test('should set eventlistener on tag idempotently', () => {
      const onClick = jest.fn();
      const node = new TestNode('div', { onClick });
      const result = node.draw();
      node.update({ onClick });
      node.draw();

      result.dispatchEvent(new MouseEvent('click'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('should remove stale eventlisteners on tag', () => {
      const onClick = jest.fn();
      const node = new TestNode('div', { onClick });
      const result = node.draw();
      result.dispatchEvent(new MouseEvent('click'));
      expect(onClick).toHaveBeenCalledTimes(1);

      node.update({});
      node.draw();
      result.dispatchEvent(new MouseEvent('click'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('should pass other attrs to tag', () => {
      const node = new TestNode('div', { id: '123' });
      const result = node.draw();
      expect(result.id).toEqual('123');
    });

    test('should not pass falsy attrs to tag except 0', () => {
      const node = new TestNode('div', { id: null, height: 0 });
      const result = node.draw();
      expect(result.id).not.toEqual(null);
      expect(result.getAttribute('height')).toEqual('0');
    });

    test('should call ref handler when draw is called', () => {
      const ref = jest.fn();
      const node = new TestNode('div', { ref });
      expect(ref).not.toHaveBeenCalled();
      const result = node.draw();
      expect(ref).toHaveBeenCalledWith(result);
    });

  });
});