import Util from './Util';
export { Util };

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

    this.childNode = Util.updateNode(this, this.childNode, this.render());

    this.props.ref && this.props.ref(this);

    const element = this.draw();
    
    if (element) {
      return this.replaceRoot(element);
    }
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    if (Util.shouldDrawNode(this.childNode)) {
      return Util.drawNode(this.childNode);
    }
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
  updateChildren(oldChildren, newChildren) {
    if (!Array.isArray(newChildren)) {
      return Util.updateNode(this, oldChildren, newChildren);
    }

    return newChildren.map((child, index) => {
      if (Array.isArray(child) && Array.isArray(oldChildren[index])) {
        return this.mutateChildrenRecursively(oldChildren[index], child);
      } else {
        return Util.updateNode(this, oldChildren[index], child);
      }
    });
  }

  update(props = this.props) {
    this.props = { ...props, children: this.updateChildren(this.props.children, props.children) };
    this.props.ref && this.props.ref(this);

    const element = this.draw();
    if (element) {
      return this.replaceRoot(element);
    }
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
