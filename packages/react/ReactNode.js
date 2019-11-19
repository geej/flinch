import { StatefulNode, Util } from '@flinch/core';
import effect from '@flinch/effect';

export default class ReactNode extends StatefulNode {
  _mounted = false;

  handleContextChange(value) {
    this.reactComponent.context = value || {};
    this.forceUpdate();
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
      this.state = this.reactComponent._tempState;
      this.reactComponent.flinchNode = this;
    }
    this.reactComponent.context = context;

    this.state = {
      ...this.state,
      ...this.component.getDerivedStateFromProps(newProps || {}, this.state)
    };

    super.update(newProps);
  }

  render() {
    return this.reactComponent.render();
  }

  @effect((props, state) => [props, state])
  handleComponentUpdates(props, state) {
    if (this._mounted) {
      this.reactComponent.componentDidUpdate(props, state);
    } else {
      this._mounted = true;
      this.reactComponent.componentDidMount();
    }
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
