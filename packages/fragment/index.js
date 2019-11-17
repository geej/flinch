import Flinch, { Node } from '@flinch/core';

export default class Fragment extends Node {
  render() {
    return this.props.children;
  }
}

Flinch.registerType({ check: klass => klass === Fragment, getClass: () => Fragment });
