import Flinch, { StatefulNode } from '@flinch/core';
import '@flinch/props-defaults';
import { render } from '@flinch/dom';
import { observer } from '@flinch/mobx';
import { observable } from 'mobx';
import effect from '@flinch/effect';
import { createContext } from '@flinch/context';

const { Provider, Consumer } = createContext(2);

function FunctionalComponent(props) {
  return props.counter;
}

FunctionalComponent.defaultProps = { counter: 99 };

@observer
class StatefulComponent2 extends StatefulNode {
  @observable clicked = 0;

  @effect(props => [props.counter]) helloThere() {
    console.log('Counter changed! Value: ', this.props.counter);
  }

  render() {
    return (
      <div onClick={() => (this.clicked = this.clicked + 1)} style={this.clicked > 0 && 'background-color: red; '}>
        <FunctionalComponent counter={this.clicked} />
      </div>
    );
  }
}

class StatefulComponent3 extends StatefulNode {
  state = { clicked: 0 };

  render() {
    return (
      <div
        onClick={() => {
          console.log(this.state.clicked + 1);
          this.setState({ clicked: this.state.clicked + 1 });
        }}
        style={this.state.clicked > 0 && { backgroundColor: 'red' }}
      >
        {this.state.clicked}
      </div>
    );
  }
}

const NodeAsPropComponent = ({ node }) => (
  <div>
    <div>{node}</div>
  </div>
);
class StatefulComponent extends StatefulNode {
  state = {
    clicked: 0
  };

  render() {
    return (
      <div>
        <Provider value={this.state.clicked}>
          <button onClick={() => this.setState({ clicked: this.state.clicked + 1 })}>+1</button>
          <FunctionalComponent counter={this.state.clicked} />
          {this.state.clicked < 10 && 'This will go away at 10'}
          <StatefulComponent3 counter={this.state.clicked} />
          <Consumer>{value => <FunctionalComponent counter={`Via Context: ${value}`} />}</Consumer>
          {this.props.children}
        </Provider>
        aaaaaa
        <StatefulComponent3 counter={this.state.clicked} />
      </div>
    );
  }
}

render(
  <div height="200" width="200">
    <StatefulComponent>
      <NodeAsPropComponent node={<StatefulComponent3 />} />
    </StatefulComponent>
  </div>,
  document.getElementById('root')
);
