import Flinch, { StatefulNode } from '@flinch/core';
import effect from '@flinch/effect';

export default class Component extends StatefulNode {
  static getDerivedStateFromProps(props, state) { return state; }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState, snapshot) {}
  getSnapshotBeforeUpdate(prevProps, prevState) { return null; }
  componentWillUnmount() {}
  shouldComponentUpdate(nextProps, nextState) {}

  @effect() handleMount() {
    this.componentDidMount();
    return () => this.componentWillUnmount();
  }

  // Legacy
  componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}

  // setState() {}
  forceUpdate() { 
    this.update(); 
  }

  setState(state, callback = () => {}) {
    let newState;
    if (typeof state === 'function') {
      newState = super.setState(state(this.state));
    } else {
      newState = super.setState(state);
    }

    callback(newState);
  }
}