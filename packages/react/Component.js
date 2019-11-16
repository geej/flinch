export default class Component {
  static contextType = null;

  constructor(props, context) {}

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
    return this.constructor;
  }

  context = {};
  state = {};

  get props() {
    return this.flinchNode.props;
  }

  forceUpdate(callback) {
    this.flinchNode.forceUpdate();
    callback && callback();
  }

  setState(state, callback = () => {}) {
    requestAnimationFrame(() => {
      const newState = typeof state === 'function' ? state(this.state) : state;
      this.state = { ...this.state, ...newState };
      this.forceUpdate(() => callback(this.state));
    });
  }
}

Object.defineProperty(Component.prototype, 'isReactComponent', { value: true });
