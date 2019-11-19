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

  set state(value) {
    if (this.flinchNode) {
      this.flinchNode.state = value;
    } else {
      this._tempState = value;
    }
  }

  get state() {
    if (this.flinchNode) {
      return this.flinchNode.state;
    } else {
      return this._tempState;
    }  }

  get props() {
    return this.flinchNode.props;
  }

  forceUpdate(callback) {
    this.flinchNode.forceUpdate(callback);
  }

  setState(state, callback = () => {}) {
    this.flinchNode.setState(state, callback);
  }
}

Object.defineProperty(Component.prototype, 'isReactComponent', { value: true });
