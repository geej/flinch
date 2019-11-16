import Flinch, { ForkNode, Util } from '@flinch/core';

export default class Fragment extends ForkNode {
  draw() {
    return Util.getFlatChildren(this.childNode).map(child => child.draw());
  }
}

Flinch.registerType({ check: klass => klass === Fragment, getClass: () => Fragment });
