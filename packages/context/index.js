import Flinch, { StatefulNode } from '@flinch/core';
import '@flinch/defaultProps';
import effect from '@flinch/effect';

let contextKey = 0;

class Consumer extends StatefulNode {
  // Find nearest provider
  // get values

  render() {
    return this.props.children(values);
  }
}

function createProvider(value) {
  class Provider extends StatefulNode {
    static defaultProps = { value }
    static contextKey = contextKey++;

    @effect('value') propagateContext() {
      // Push the context down
    }

    render() {
      return this.props.children;
    }
  }
}

export function createContext(initialValue) {
  const Provider, Consumer;
  return { Provider, Consumer };
}