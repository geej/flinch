import { Util } from '@flinch/core';

export default {
  forEach: (children, fn) => Util.getFlatChildren(children).forEach(child => fn(child)),
  only: children => {
    const flat = Util.getFlatChildren(children);
    if (flat.length !== 1) {
      throw new Error('There is more than one child!');
    }

    return flat[0];
  },
  count: children => Util.getFlatChildren(children).length,
  toArray: children => Util.getFlatChildren(children)
};