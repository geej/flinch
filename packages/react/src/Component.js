export default class Component {
  static contextType = null;
  static getDerivedStateFromProps(props, state) { return state; }

  context = {};

  constructor(props) {
    this._props = props;
  }

  // Supported
  // componentDidMount() {}
  // componentDidUpdate(prevProps, prevState, snapshot) {}
  // componentWillUnmount() {}

  // Will Support
  // getSnapshotBeforeUpdate(prevProps, prevState) {}
  // shouldComponentUpdate(nextProps, nextState) {}

  // Legacy - Unsupported
  // componentWillMount() {}
  // UNSAFE_componentWillUpdate(nextProps, nextState) {}
  // UNSAFE_componentWillReceiveProps(nextProps) {}

  get type() {
    return this.constructor;
  }

  set state(value) {
    if (this.flinchNode) {
      this.flinchNode.state = value;
    } else {
      this._state = value;
    }
  }

  get state() {
    return this.flinchNode ? this.flinchNode.state : this._state;
  }

  get props() {
    return this.flinchNode ? this.flinchNode.props : this._props;
  }

  forceUpdate(callback) {
    this.flinchNode.forceUpdate(callback);
  }

  setState(state, callback) {
    this.flinchNode.setState(state, callback);
  }
}

Object.defineProperty(Component.prototype, 'isReactComponent', { value: true });
