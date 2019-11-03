/* @jsx Node.create */ 

import { render } from '@flinch/flinch-dom';
import { StatefulNode, Node } from '@flinch/flinch-core';

function FunctionalComponent(props) {
  return <div>Clicked: { props.counter || 0 }</div>;
}

class StatefulComponent2 extends StatefulNode {
  state = {
    clicked: 0
  }


  render() {
    return <div onClick={ () => this.setState({ clicked: this.state.clicked + 1 }) }><FunctionalComponent counter={this.state.clicked} /></div>;
  }
}

class StatefulComponent extends StatefulNode {
  state = {
    clicked: 0
  }


  render() {
    return <div><button onClick={ () => this.setState({ clicked: this.state.clicked + 1 }) }>+1</button><FunctionalComponent counter={this.state.clicked} />{ this.state.clicked < 10 && 'This will go away at 10' }<StatefulComponent2 /></div>;
  }
}



render(<div height="200" width="200"><StatefulComponent></StatefulComponent></div>, document.getElementById('root'));