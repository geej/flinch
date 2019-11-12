export default class Component {
  constructor(props, context) {

  }
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
    let newState;
    setTimeout(() => {
      if (typeof state === 'function') {
        this.state = { ...this.state, ...state(this.state) };
      } else {
        this.state = { ...this.state, ...state };
      }

      this.forceUpdate();
      callback(newState);
    }, 0)
  }
}

Object.defineProperty(Component.prototype, 'isReactComponent', { value: true });
