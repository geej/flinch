import Flinch, { StatefulNode } from '@flinch/core';
import effect from '@flinch/effect';
import { observe } from 'mobx';

/**
 * Observer wraps a StatefulNode, and triggers a Flinch state change when
 * a MobX observable changes.
 *
 * @param {StatefulNode} Component - component to watch
 */

export default function(Component) {
  return class ObservedComponent extends StatefulNode {
    state = { mutator: 0 };

    @effect() componentDidMount() {
      observe(this.ref, () => this.setState({ mutator: this.state.mutator + 1 }));
    }

    render() {
      return Flinch.create(Component, {
        ref: ref => this.ref = ref,
        _mobXMutator: this.state.mutator,
        ...this.props
      });
    }
  };
}
