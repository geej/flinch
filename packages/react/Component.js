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
    this._lastProps = this.props;
    this._lastState = this.state;

    this.state = {
      ...this.state,
      ...this.constructor.getDerivedStateFromProps(newProps || {}, this.state)
    };

    super.update(newProps);
  }

  draw() {
    const result = super.draw();
    // CDU expects the child refs to be resolved, and expects to be fired before CDM of children
    setTimeout(() => this.componentDidUpdate(this._lastProps, this._lastState), 0);
    return result;
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
