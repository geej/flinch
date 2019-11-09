import Flinch, { StatefulNode } from '@flinch/core';
import '@flinch/props-defaults';
import effect from '@flinch/effect';

export function createContext(value) {
  class Provider extends StatefulNode {
    static defaultProps = { value };
    callbacks = [];

    registerCallback(callback) {
      this.callbacks.push(callback);
      return this.props.value;
    }

    @effect('value') pushContext() {
      this.callbacks.forEach(cb => cb(this.props.value));
    }

    render() {
      return Flinch.create('div', undefined, this.props.children);
    }
  }

  class Consumer extends StatefulNode {
    state = { value };

    handleContextChange = value => this.setState({ value });

    @effect() findProvider() {
      let node = this.parent;
      while (node && !(node instanceof Provider)) {
        node = node.parent;
      }

      if (node) {
        this.setState({
          value: node.registerCallback(this.handleContextChange)
        });
      }
    }

    render() {
      return typeof this.props.children === 'function' && this.props.children(this.state.value);
    }
  }

  return { Provider, Consumer };
}
