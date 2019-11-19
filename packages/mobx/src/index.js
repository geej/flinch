import Flinch, { StatefulNode } from '@flinch/core';
import effect from '@flinch/effect';

import { observe } from 'mobx';

/**
 * Observer wraps a StatefulNode, and triggers a Flinch state change when
 * a MobX observable changes.
 *
 * @param {StatefulNode} Component - component to watch
 */

// TODO: This whole thing is broken
export function observer(Component) {
  return class ObservedComponent extends StatefulNode {
    state = { mutator: 0 };

    @effect()
    componentDidMount() {
      // TODO: This ref can change if the component's root node changes
      if (this.ref) {
        observe(this.ref, () => this.setState({ mutator: this.state.mutator + 1 }));
      }
    }

    render() {
      return <Component ref={ref => (this.ref = ref)} _mobXMutator={this.state.mutator} {...this.props} />;
    }
  };
}
