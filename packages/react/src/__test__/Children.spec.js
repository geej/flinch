import Children from '../Children';

describe('Children', () => {
  describe('forEach', () => {
    test('should operate on each child once', () => {
      const fn = jest.fn();
      Children.forEach([[], ['b'], 'a'], fn);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('should operate on only child', () => {
      const fn = jest.fn();
      Children.forEach('a', fn);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should not operate on undefined child', () => {
      const fn = jest.fn();
      Children.forEach(undefined, fn);

      expect(fn).not.toHaveBeenCalled();
    });
  });


  describe('only', () => {
    test('should return only child from array', () => {
      const child = Children.only([ [],[ [ 'hi' ] ] ]);
      expect(child).toEqual('hi');
    });

    test('should return only child', () => {
      const child = Children.only('hi');
      expect(child).toEqual('hi');
    });

    test('should throw if no children', () => {
      expect(() => Children.only()).toThrow();
    });

    test('should throw if more than one child', () => {
      expect(() => Children.only([ 1, 2 ])).toThrow();
    });
  });

  describe('count', () => {
    test('should return number of items', () => {
      const count = Children.count([1, [2, [3]], [], 4 ]);
      expect(count).toEqual(4);
    });
  });

  describe('toArray', () => {
    test('should return flat array', () => {
      const array = Children.toArray([1, [2, [3]], [], 4 ]);
      expect(array).toEqual([ 1, 2, 3, 4 ]);
    });

    test('should covert value to array', () => {
      const array = Children.toArray(1);
      expect(array).toEqual([ 1 ]);
    });
  });

  describe('map', () => {
    test('should operate on each child once', () => {
      const fn = jest.fn();
      const result = Children.map([[], ['b'], 'a'], fn);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(result.length).toEqual(2);
    });

    test('should operate on only child', () => {
      const fn = jest.fn();
      const result = Children.map('a', fn);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(result.length).toEqual(1);
    });

    test('should not operate on undefined child', () => {
      const fn = jest.fn();
      const result = Children.map(undefined, fn);

      expect(fn).not.toHaveBeenCalled();
      expect(result.length).toEqual(0);
    });
  });
});