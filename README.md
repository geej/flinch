# flinch
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![GitHub](https://img.shields.io/github/license/geej/flinch)
![](https://github.com/geej/flinch/workflows/Node%20CI/badge.svg)

Flinch is a lightweight, modular Javascript framework that is built for simplicity and readability. Modules are provided
for popular features like context, lifecycle events, portals, and more.

## Usage

Getting started with Flinch is easy and familiar to anyone with React experience.

```javascript
import Flinch from '@flinch/core';
import render from '@flinch/dom';

const App = () => <div>This is a component!</div>;

render(<App />, document.getElementById('root'));
```

Out of the box, Flinch supports 2 basic types of nodes.

### Functional nodes

```javascript
import Flinch from '@flinch/core';

const MyNode = props => <a href={props.url}>{props.name}</a>;
```

### Stateful nodes

```javascript
import Flinch, { StatefulNode } from '@flinch/core';

class MyStatefulNode extends StatefulNode {
  state = { counter: 0 }

  handleClick = () => this.setState({ counter: this.state.counter + 1 });

  render() {
    return <div onClick={this.handleClick}>Clicked { this.state.counter } times!</div>;
  }
}
```

## Modules

* [@flinch/core](packages/core)
* [@flinch/dom](packages/dom)
* [@flinch/context](packages/context)
* [@flinch/effect](packages/effect)
* [@flinch/mobx](packages/mobx)
* [@flinch/portal](packages/portal)
* [@flinch/react](packages/react)
* [@flinch/react-hooks](packages/react-hooks)
