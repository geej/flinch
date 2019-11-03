/* @jsx Flinch.create */ 

import { render } from '@flinch/flinch-dom';
import Flinch, { StatefulNode } from '@flinch/flinch-core';
import { Observer } from '@flinch/flinch-mobx';
import { observable } from 'mobx';

function FunctionalComponent(props) {
  return <div>Clicked: { props.counter || 0 }</div>;
}

@Observer
class StatefulComponent2 extends StatefulNode {
  @observable clicked = 0;

  render() {
    return <div onClick={ () => (this.clicked = this.clicked + 1) }><FunctionalComponent counter={this.clicked} /></div>;
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