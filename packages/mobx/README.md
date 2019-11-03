# @flinch/mobx
A simple higher-order component to trigger a state change when a MobX observable mutates.
## Usage
~~~~ 
import Flinch, { StatefulNode } from '@flinch/core';
import { Observer } from '@flinch/mobx';
import { observable } from 'mobx';

@Observer
class ObservedNode extends StatefulNode {
  @observable x = 0;

   handleClick = () => this.x++;

  render() {
    return <button onClick={this.handleClick}>{ this.x }</button>;
  }
}
~~~~