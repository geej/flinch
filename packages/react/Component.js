import Flinch, { StatefulNode } from "@flinch/core";
import effect from "@flinch/effect";

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

  context = {};

  constructor(Component, props) {
    super(Component, props);
  }

  update(newProps) {
    this.state = {
      ...this.state,
      ...this.constructor.getDerivedStateFromProps(this.props, this.state)
    };
    super.update(newProps);
  }

  @effect() handleMount() {
    this.componentDidMount();
    this.setState(
      this.constructor.getDerivedStateFromProps(this.props, this.state)
    );
    return () => this.componentWillUnmount();
  }

  forceUpdate() {
    this.update();
  }

  setState(state, callback = () => {}) {
    let newState;
    if (typeof state === "function") {
      newState = super.setState(state(this.state));
    } else {
      newState = super.setState(state);
    }

    callback(newState);
  }
}

Object.defineProperty(Component.prototype, "isReactComponent", { value: true });
