import Flinch, { ForkNode, Util } from '@flinch/core';

export default class Fragment extends ForkNode {
  draw() {
    return Util.getFlatChildren(this.props.children).map(child => Util.drawNode(child));
  }
}

Flinch.registerType({ check: klass => klass === Fragment, getClass: () => Fragment });
