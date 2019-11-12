import { Node } from '@flinch/core';
import effect from '@flinch/effect';

export default class ReactNode extends Node {
  context = {};

  update(newProps) {
    // Context isn't available until a component is mounted in the virtualdom
    // this means a react 'Component' is not actually initialized until it's mounted
    // this means a react component is *NOT* the same as a Node, rather that a node
    // has a component
    if (!this.reactComponent) {
      this.reactComponent = new this.component(this.props, this.context);
      this.reactComponent.flinchNode = this;
    }

    // componentDidUpdate will fire after this draw cycle is complete, so it's okay to store the
    // timeout now. This also ensures that CDU will fire before CDM of the children, which is
    // consistent with React's behavior.
    const oldProps = this.props;
    const oldState = this.reactComponent.state;
    setTimeout(() => this.reactComponent.componentDidUpdate(oldProps, oldState), 0);

    this.reactComponent.state = {
      ...this.reactComponent.state,
      ...this.component.getDerivedStateFromProps(newProps || {}, this.reactComponent.state)
    };

    super.update(newProps);
  }

  @effect() handleMount() {
    this.reactComponent.componentDidMount();
    return () => this.reactComponent.componentWillUnmount();
  }

  render() {
    return this.reactComponent.render();
  }

  getRef() {
    return this.reactComponent;
  }

  get type() {
    return this.component;
  }
}