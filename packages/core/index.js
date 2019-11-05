export const Util = {
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
  shouldRenderNode: node => node || node === 0,
  drawNode: node =>
    Util.isPrimitive(node)
      ? document.createTextNode(node)
      : node.replaceRoot(node.draw()),
  mutateChildrenRecursively: function(oldChildren, newChildren) {
    // TODO this can be inverted for code reduction (start with array check, then do recursion)

    if (!Array.isArray(newChildren)) {
      return newChildren;
    }

    return newChildren.map((child, index) => {
      if (!child && child !== 0 || Util.isPrimitive(child)) {
        return child;
      }
      
      let resolvedChild = oldChildren[index];

      if (Array.isArray(child)) {
        if (!Array.isArray(oldChildren[index])) {
          resolvedChild = child;
        } else {
          resolvedChild = Util.mutateChildrenRecursively(oldChildren[index], child);
        }
      } else if (
        child.component !== oldChildren[index].component
      ) {
        resolvedChild = child;
      }

      resolvedChild.update && resolvedChild.update(child.props);
      return resolvedChild;
    });
  },
  mutateTree: node => {
    const oldTree = node.tree;
    let newTree = node.render();

    // Sometimes render (in React specifically) returns an array... not sure why
    if (Array.isArray(newTree)) {
      newTree = newTree[0];
    }

    let newProps;
    if (
      oldTree &&
      !Util.isPrimitive(newTree) &&
      oldTree.component === newTree.component
    ) {
      const { children, ...otherProps } = newTree.props;
      newProps = {
        ...otherProps,
        children: Util.mutateChildrenRecursively(
          oldTree.props.children,
          children
        )
      };
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
        typeof component === "function" && Object.getPrototypeOf(component) === Object.getPrototypeOf(function() {}),
      getClass: () => FunctionalNode
    }
  ];

  static create(tag, props, ...children) {
    //children = children.length === 1 ? children[0] : children;

    for (let type of this.typeRegistry) {
      if (type.check(tag)) {
        const Klass = type.getClass(tag);
        // Bug here
        const fullProps = {
          ...props,
          // children: props && props.children || children
          children:
            props &&
            props.children &&
            props.children.length &&
            props.children[0]
              ? props.children
              : children
        };
        const instance = new Klass(tag, fullProps);

        // React is dumb. Extract this to middleware and put in react
        instance.props = fullProps;
        instance.component = tag;

        return instance;
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
    Util.getFlatChildren(this.props.children).forEach(child => {
      if (Util.shouldRenderNode(child)) {
        const node = Util.drawNode(child);
        fragment.appendChild(node);
      }
    });

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
    this.update(this.props);
    return this.state;
  }
}
