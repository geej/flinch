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
  mutateChildrenRecursively: function(oldChildren, newChildren, node) {
    // TODO this can be inverted for code reduction (start with array check, then do recursion)

    if (!Array.isArray(newChildren)) {
      if(newChildren.update){
        if (newChildren.component === oldChildren.component) {
          oldChildren.update(newChildren.props);
          return oldChildren;
        }
        newChildren.update();
      } 
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
          resolvedChild = Util.mutateChildrenRecursively(oldChildren[index], child, node);
        }
      } else if (
        child.component !== oldChildren[index].component
      ) {
        resolvedChild = child;
      }

      resolvedChild.parent = node;
      resolvedChild.update && resolvedChild.update(child.props);
      return resolvedChild;
    });
  },
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
    children = children.length === 1 ? children[0] : children;

    for (let type of this.typeRegistry) {
      if (type.check(tag)) {
        const Klass = type.getClass(tag);
        // Bug here
        const fullProps = {
          ...props,
          children: props && props.children || children
          // children:
          //   props &&
          //   props.children &&
          //   props.children.length &&
          //   props.children[0]
          //     ? props.children
          //     : children
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

    const newChild = this.render();

    if (
      !this.childNode ||
      Util.isPrimitive(newChild) ||
      this.childNode.component !== newChild.component
    ) {
      this.childNode = newChild;
    }

    if (this.childNode.update) {
      this.childNode.parent = this;
      this.childNode.update(newChild.props);
    }

    this.props.ref && this.props.ref(this);
    return this.replaceRoot(this.draw());
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    return Util.drawNode(this.childNode);
  }

  replaceRoot(node) {
    if (this.root && this.root.parentNode) {
      this.root.parentNode.replaceChild(node, this.root);
    }
    this.root = node;
    return this.root;
  }
}

export class ForkNode extends Node {
  update(props = this.props) {
    // TODO: Clean this terrible mess up
    const children = Util.mutateChildrenRecursively(this.props.children, props.children, this);
    this.props = { ...props, children };

    this.props.ref && this.props.ref(this);
    return this.replaceRoot(this.draw());
  }

  draw() {
    return Util.drawNode(this.tree);
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
