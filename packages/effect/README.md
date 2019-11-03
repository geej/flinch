# @flinch/effect

Effect is a method decorator for StatefulNodes that is similar to useEffect in React's hooks. decorated methods will run on mount, and again whenever the list of props changes. If there are no props provided, the effect will only run on mount.

## Usage
~~~~
import effect from '@flinch/effect';

class MyComponent extends StatefulNode {
  @effect('aProp')
  handleAPropChange() {
    console.log('aProp changed!');
  }

  render() {
    return <div>{ this.props.aProp }</div>;
  }
}