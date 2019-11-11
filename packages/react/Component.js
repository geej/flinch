import Flinch, { StatefulNode } from '@flinch/core';
import effect from '@flinch/effect';

export default class Component extends StatefulNode {
  static getDerivedStateFromProps(props, state) {
    return state;
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState, snapshot) {}
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null;
  }
  componentWillUnmount() {}
  shouldComponentUpdate(nextProps, nextState) {}

  // Legacy
  //componentWillMount() {}
  //UNSAFE_componentWillUpdate(nextProps, nextState) {}
  //UNSAFE_componentWillReceiveProps(nextProps) {}

  get type() {
    return this.component;
  }

  context = {};

  update(newProps) {
    // componentDidUpdate will fire after this draw cycle is complete, so it's okay to store the
    // timeout now. This also ensures that CDU will fire before CDM of the children, which is
    // consistent with React's behavior.
    const oldProps = this.props;
    const oldState = this.state;
    setTimeout(() => this.componentDidUpdate(oldProps, oldState), 0);

    this.state = {
      ...this.state,
      ...this.constructor.getDerivedStateFromProps(newProps || {}, this.state)
    };

    super.update(newProps);
  }

  @effect() handleMount() {
    this.componentDidMount();
    return () => this.componentWillUnmount();
  }

  forceUpdate(callback) {
    super.forceUpdate();
    callback && callback();
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

Object.defineProperty(Component.prototype, 'isReactComponent', { value: true });
