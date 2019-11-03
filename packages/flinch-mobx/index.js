import Flinch, { StatefulNode } from '@flinch/flinch-core';
import { observe } from 'mobx';

/* @jsx Flinch.create */

export function Observer(Component) {
  return class ObservedComponent extends StatefulNode {
    state = { mutator: 0 };

    componentDidMount() {
      if (this.ref) {
        observe(this.ref, () => this.setState({ mutator: this.state.mutator + 1 }));
      }
    }

    render() {
      return <Component ref={ref => (this.ref = ref)} _mobXMutator={this.state.mutator} { ...this.props } />;
    }
  }
}
