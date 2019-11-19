# @flinch/effect

Effect is a method decorator for StatefulNodes that is similar to useEffect in React's hooks. Decorated methods will run on mount, and again whenever the list of props changes. If there are no props provided, the effect will only run on mount.

## Usage
~~~~
import effect from '@flinch/effect';

class MyComponent extends StatefulNode {
  @effect(props => [ prop.a, prop.b ])
  handleChange(oldA, oldB) {
    console.log('a or b changed!');
  }

  @effect
  handleUpdate() {
    console.log('this will fire every update');
  }

  @effect()
  handleMount() {
    console.log('this will only fire on mount');
  }

  render() {
    return <div>{ this.props.a }</div>;
  }
}
~~~~
