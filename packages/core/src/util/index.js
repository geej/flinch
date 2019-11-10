import ForkNode from '../ForkNode';

const Util = {
  isPrimitive: node => node !== Object(node),
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
  drawNode: node => {
    return Util.isPrimitive(node)
      ? node
      : node.draw()
  },
  updateNode: (context, oldNode, newNode) => {
    // Need to shallow clone all forknodes here on the off chance that a node is rendered in two places.
    if (oldNode instanceof ForkNode) {
      oldNode = Util.cloneNode(oldNode);
    }

    let node = oldNode;

    if (
      !oldNode ||
      Util.isPrimitive(newNode) ||
      oldNode.component !== newNode.component
    ) {
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
