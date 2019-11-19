import Primitive from '../Primitive';
import Fragment from '../Fragment';
import Core from '../Core';
const Util = {
  getFlatChildren: function(children) {
    if (!children && children !== 0) return [];

    if (!Array.isArray(children)) {
      children = [children];
    }

    return children.reduce(
      (memo, value) => (Array.isArray(value) ? [...memo, ...Util.getFlatChildren(value)] : [...memo, value]),
      []
    );
  },
  updateNode: (context, oldNode, newNode) => {
    if (newNode !== Object(newNode)) {
      if (oldNode instanceof Primitive) {
        oldNode.update(newNode);
        return oldNode;
      } else {
        oldNode && oldNode.unmount && oldNode.unmount();
        return new Core.Primitive(newNode);
      }
    }

    let node = oldNode;

    if (!oldNode || oldNode.component !== newNode.component || oldNode.props.key !== newNode.props.key) {
      oldNode && oldNode.unmount && oldNode.unmount();
      if (newNode instanceof Fragment) {
        newNode = Util.cloneNode(newNode);
      }
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
  cloneNode: element => Object.assign(Object.create(Object.getPrototypeOf(element)), element),
  findClosestAncestorWhere: (node, fn) => {
    let cursor = node;
    while (cursor && !fn(cursor)) {
      cursor = cursor.parent;
    }
    return cursor;
  }
};

export default Util;
