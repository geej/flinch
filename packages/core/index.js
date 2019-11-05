export const Util = {
  isPrimitive: node => node !== Object(node),
  getFlatChildren: function(children) {
    return children.reduce(
      (memo, value) =>
        Array.isArray(value) ? [...memo, ...Util.getFlatChildren(value)] : [...memo, value],
      []
    )
  },
  shouldRenderNode: node => node || node === 0,
  drawNode: node => Util.isPrimitive(node) ? document.createTextNode(node) : node.replaceRoot(node.draw()),
  mutateChildrenRecursively: function(oldChildren, newChildren) {
    return newChildren.map((child, index) => {
      let resolvedChild = oldChildren;

      if (!child && child !== 0) resolvedChild = child;
      
      if (Array.isArray(child)) {
        if (Array.isArray(oldChildren[index])) {
          resolvedChild = Util.mutateChildrenRecursively(oldChildren[index], child);
        } else {
          resolvedChild = child;
        }
      }

      if (child.component !== oldChildren[index].component || Util.isPrimitive(child)) {
        resolvedChild = child;
      }

      if (resolvedChild.update) {
        resolvedChild.update(child.props);
      }
      return resolvedChild;
    });
  },
  mutateTree: (node) => {
    // By virtue of JSX, a component will always have the same number of ROOT LEVEL children. If it doesn't have
    // the same number of root level children, it is not the same tree

    const oldTree = node.tree;
    let newTree = node.render();

    if (Array.isArray(newTree)) {
      newTree = newTree[0];
    }

    let newProps;
    if (oldTree && !Util.isPrimitive(newTree) && oldTree.component === newTree.component && oldTree.props.children.length === newTree.props.children.length) {
      const { children, ...otherProps } = newTree.props;
      newProps = { ...otherProps, children: Util.mutateChildrenRecursively(oldTree.props.children, children) };
      node.tree = oldTree;
    } else {
      node.tree = newTree;    
    }

    if (Util.isPrimitive(node.tree)) {
      return;
    }
    
    if (node !== node.tree) {
      node.tree.parent = node;
      node.tree.update(newProps);
    }

    // TODO: This calls update twice on some children from the oldTree. This is bad. Fix it.
    Util.getFlatChildren(node.tree.props.children).forEach(child => {
      if (child && child.update) {
        child.parent = node.tree;
        child.update();
      }
    });
  }
};

export default class Core {
  static typeRegistry = [
    {
      check: klass => StatefulNode.isPrototypeOf(klass),
      getClass: klass => klass
    },
    {
      check: component =>
        typeof component === "function" &&
        !StatefulNode.isPrototypeOf(component),
      getClass: () => FunctionalNode
    }
  ];

  static create(tag, props, ...children) {
    for (let type of this.typeRegistry) {
      if (type.check(tag)) {
        const Klass = type.getClass(tag);
        // Bug here
        return new Klass(tag, { children, ...props });
      }
    }
  }

  static registerType(typeObject) {
    Core.typeRegistry.push(typeObject);
  }
}

export class Node {
  constructor(component, props) {
    this.props = props;
    this.component = component;
  }

  update(props = this.props) {
    this.props = props;
    Util.mutateTree(this);
    this.props.ref && this.props.ref(this);
    return this.replaceRoot(this.draw());
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    return Util.drawNode(this.tree);
  }

  replaceRoot(node) {
    if (this.root && this.root.parentNode) {
      this.root.parentNode.replaceChild(node, this.root);
    }
    this.root = node;
    return this.root;
  }

  getResolvedChildren() {
    const fragment = document.createDocumentFragment();
    Util.getFlatChildren(this.props.children).forEach(
      child =>
        Util.shouldRenderNode(child) &&
        fragment.appendChild(
          Util.drawNode(child)
        )
    );

    return fragment;
  }
}

class FunctionalNode extends Node {
  render() {
    return this.component(this.props);
  }
}

export class StatefulNode extends Node {  
  state = {};

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update(this.props, );
    return this.state;
  }
}
