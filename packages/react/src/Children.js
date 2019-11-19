const getFlatChildren = children => {
  children = Array.isArray(children) ? children : [children];
  return children.reduce((memo, value) => (Array.isArray(value) ? [...memo, ...value] : [...memo, value]), []);
};

export default {
  forEach: (children, fn) => getFlatChildren(children).forEach(child => fn(child)),
  only: children => {
    const flat = getFlatChildren(children);
    if (flat.length !== 1) {
      throw new Error('There is more than one child!');
    }

    return flat[0];
  },
  count: children => getFlatChildren(children).length,
  toArray: children => getFlatChildren(children),
  map: (children, fn) => getFlatChildren(children).map(child => fn(child))
};
