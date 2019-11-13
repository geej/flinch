import { StatefulNode } from '@flinch/core';

export default class ReactNode extends StatefulNode {
  mounted = false;

  handleContextChange(value) {
    this.reactComponent.context = value || {};
    this.reactComponent.forceUpdate();
  }

  getLegacyContext() {
    let cursor = this.parent;
    while (cursor && !(cursor.reactComponent && cursor.reactComponent.getChildContext)) {
      cursor = cursor.parent;
    }

    return cursor && cursor.reactComponent.getChildContext() || {};
  }

  get key() {
    return this.props.key;
  }

  update(newProps) {
    // Context isn't available until a component is mounted in the virtualdom
    // this means a react 'Component' is not actually initialized until it's mounted
    // this means a react component is *NOT* the same as a Node, rather that a node
    // has a component

    let context;
    if (this.component.contextTypes) {
      context = this.getLegacyContext();
    }

    if (!this.reactComponent) {
      if (this.component.contextType) {
        context = this.component.contextType.findProvider(this);
      }

      this.reactComponent = new this.component(this.props, context || {});
      this.reactComponent.flinchNode = this;
    }
    this.reactComponent.context = context;

    // componentDidUpdate will fire after this draw cycle is complete, so it's okay to store the
    // timeout now. This also ensures that CDU will fire before CDM of the children, which is
    // consistent with React's behavior.
    const oldProps = this.props;
    const oldState = this.reactComponent.state;
    if (this.mounted) {
      requestAnimationFrame(() => this.reactComponent.componentDidUpdate(oldProps, oldState));
    }

    this.reactComponent.state = {
      ...this.reactComponent.state,
      ...this.component.getDerivedStateFromProps(newProps || {}, this.reactComponent.state)
    };

    super.update(newProps);

    if (!this.mounted) {
      this.mounted = true;

      // TODO: This needs to be run synchronously... but how are we going to do that?
      requestAnimationFrame(() => this.reactComponent.componentDidMount());
    }
  }

  render() {
    return this.reactComponent.render();
  }

  unmount() {
    this.reactComponent.componentWillUnmount();
    super.unmount();
  }

  getRef() {
    return this.reactComponent;
  }

  get type() {
    return this.component;
  }
}