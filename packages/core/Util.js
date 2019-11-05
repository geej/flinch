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
  shouldDrawNode: node => node || node === 0,
  drawNode: node =>
    Util.isPrimitive(node)
      ? document.createTextNode(node)
      : node.replaceRoot(node.draw()),
  mutateChildrenRecursively: function(oldChildren, newChildren, node) {
    if (!Array.isArray(newChildren)) {
      return Util.updateNode(node, oldChildren, newChildren);
    }

    return newChildren.map((child, index) => {
      if (Array.isArray(child) && Array.isArray(oldChildren[index])) {
        return Util.mutateChildrenRecursively(oldChildren[index], child, node);
      } else {
        return Util.updateNode(node, oldChildren[index], child);
      }
    });
  },
  updateNode: (context, oldNode, newNode) => {
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
  }
};

export default Util;
