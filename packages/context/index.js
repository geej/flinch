import Flinch, { StatefulNode } from '@flinch/core';
import '@flinch/props-defaults';
import effect from '@flinch/effect';
import {Util} from '@flinch/core';

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
      return this.props.children;
    }

    draw() {
      return Util.getFlatChildren(this.childNode).map(child => child.draw());
    }
  }

  // This is poorly named
  function findProvider(child) {
    let node = child.parent;
    while (node && !(node instanceof Provider)) {
      node = node.parent;
    }

    return node && node.registerCallback(child.handleContextChange);
  }

  class Consumer extends StatefulNode {
    state = { value };

    handleContextChange = value => this.setState({ value });

    @effect() findProvider() {
      this.setState({
        value: findProvider(this)
      });
    }

    render() {
      return typeof this.props.children === 'function' && this.props.children(this.state.value);
    }
  }

  return { Provider, Consumer, findProvider };
}
