import { StatefulNode, Util } from '@flinch/core';

const events = [];
let eventTimeout;

export default class ReactNode extends StatefulNode {
  __mounted = false;

  handleContextChange(value) {
    this.reactComponent.context = value || {};
    this.reactComponent.forceUpdate();
  }

  getLegacyContext() {
    const node = Util.findClosestAncestorWhere(
      this.parent,
      node => node.reactComponent && node.reactComponent.getChildContext
    );
    return (node && node.reactComponent.getChildContext()) || {};
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

    // Parent CDM needs to occur before child is mounted, which means... what does this mean?
    const oldProps = this.props;
    const oldState = this.reactComponent.state;

    if (this.__mounted) {
      events.push(() => this.reactComponent.componentDidUpdate(oldProps, oldState));
    }

    this.reactComponent.state = {
      ...this.reactComponent.state,
      ...this.component.getDerivedStateFromProps(newProps || {}, this.reactComponent.state)
    };

    super.update(newProps);

    if (!this.__mounted) {
      this.__mounted = true;
      events.push(() => this.reactComponent.componentDidMount());
    }

    if (!eventTimeout) {
      eventTimeout = requestAnimationFrame(() => {
        let event;
        while ((event = events.shift())) event();
        eventTimeout = null;
      });
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
