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
          ...Util.cleanProps(props),
          // TODO: This is some bullshit but sometimes children can be an empty array, and we want to treat it as if that's nothing
          children: props && props.children && !(Array.isArray(props.children) && props.children.length === 0) && props.children || children
          //children: props && props.children || children
        };
        const instance = new Klass(fullProps, {});

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
  update(props = this.props) {
    const { ref, ...otherProps } = props;
    ref && ref(this.root || this);

    this.props = otherProps;
    this.childNode = Util.updateNode(this, this.childNode, this.render());
  }

  forceUpdate() {
    this.update();
    return this.draw();
  }

  render() {
    throw new Error("render must be defined by a child class!");
  }

  draw() {
    if (Util.shouldDrawNode(this.childNode)) {
      return Util.drawNode(this.childNode);
    }
  }
}

export class ForkNode extends Node {
  updateChildren(oldChildren, newChildren) {
    if (!Array.isArray(newChildren)) {
      return Util.updateNode(this, oldChildren, newChildren);
    }

    return newChildren.map((child, index) => {
      if (Array.isArray(child) && Array.isArray(oldChildren[index])) {
        return this.updateChildren(oldChildren[index], child);
      } else {
        return Util.updateNode(this, oldChildren[index], child);
      }
    });
  }

  update(props = this.props) {
    const { ref, ...otherProps } = props;
    this._ref = ref;
    this.props = { ...otherProps, children: this.updateChildren(this.props.children, props.children) };
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
    this.forceUpdate();
    return this.state;
  }
}
