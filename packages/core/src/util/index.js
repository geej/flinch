import ForkNode from '../ForkNode';
import Primitive from '../Primitive';

const Util = {
  getFlatChildren: function(children) {
    if (!children && children !== 0) return [];

    if (!Array.isArray(children)) {
      children = [ children ];
    }

    return children.reduce(
      (memo, value) =>
        Array.isArray(value)
          ? [...memo, ...Util.getFlatChildren(value)]
          : [...memo, value],
      []
    );
  },
  updateNode: (context, oldNode, newNode) => {
    // Need to shallow clone all forknodes here on the off chance that a node is rendered in two places.
    if (oldNode instanceof ForkNode) {
      oldNode = Util.cloneNode(oldNode);
    }

    if (newNode !== Object(newNode)) {
      if (oldNode instanceof Primitive) {
        oldNode.update(newNode);
        return oldNode;
      } else {
        oldNode && oldNode.unmount && oldNode.unmount();
        return new Primitive(newNode);
      }
    }

    let node = oldNode;

    if (!oldNode || oldNode.component !== newNode.component || oldNode.props.key !== newNode.props.key) {
      oldNode && oldNode.unmount && oldNode.unmount();
      node = newNode;
    }

    if (node && node.update) {
      node.parent = context;
      node.update(newNode.props);
    }

    return node;
  },
  cleanProps: props => {
    if (!props) return;

    return Object.keys(props).reduce((memo, key) => {
      if (props[key] !== undefined) {
        memo[key] = props[key];
      }
      return memo;
    }, {});
  },
  cloneNode: element => Object.assign(Object.create(Object.getPrototypeOf(element)), element)
};

export default Util;
