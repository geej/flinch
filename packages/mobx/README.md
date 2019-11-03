# @flitch/mobx
A simple higher-order component to trigger a state change when a MobX observable mutates.
## Usage
~~~~ 
import { Observer } from '@flinch/flinch-mobx';
import { observable } from 'mobx';
import Flinch, { StatefulNode } from '@flinch/flinch-core';

@Observer
class ObservedNode extends StatefulNode {
  @observable x = 0;

   handleClick = () => this.x++;

  render() {
    return <button onClick={this.handleClick}>{ this.x }</button>;
  }
}
~~~~