const Util = {
  isPrimitive: node => node !== Object(node),
  getFlatChildren: node => node.props.children.reduce((memo, value) => Array.isArray(value) ? [ ...memo, ...value ] : [ ...memo, value ], []),
  shouldRenderNode: node => node || node === 0,
  getNewTree: (oldTree, newTree) => {
    // NOTE: This is not remotely done

    // By virtue of JSX, a component will always have the same number of ROOT LEVEL children. If it doesn't have
    // the same number of root level children, it is not the same tree

    // If the type of root node changes, we should dump the whole subtree and replace everything. (should we?)

    if (!oldTree) return newTree;

    if (
      oldTree.props.children.length === newTree.props.children.length && oldTree.props.children.every((value, index) => {
        if (Util.isPrimitive(value)) {
          return Util.isPrimitive(newTree.props.children[index]);
        }
        
        return value.component === newTree.props.children[index].component;
      })
    ) {
      oldTree.props.children.forEach((child, index) => {
        if (Util.isPrimitive(child)) {
          oldTree.props.children[index] = newTree.props.children[index];
          return;
        }
        child.props = newTree.props.children[index].props;
      });

      // There is a props bug here. Only children is correctly moved.
      newTree.props.children = oldTree.props.children;
    }
    
    return newTree.component === oldTree.component ? oldTree : newTree;
  }
}

export default class Core {
  static typeRegistry = [
    { check: klass => StatefulNode.isPrototypeOf(klass), getClass: klass => klass },
    { check: component => typeof component === 'function' && !StatefulNode.isPrototypeOf(component), getClass: () => FunctionalNode },
  ];

  static create(tag, props, ...children) {
    for (let type of this.typeRegistry) {
      if (type.check(tag)) {
        const Klass = type.getClass(tag);
        return new Klass(tag, { ...props, children });
      }
    }
  }

  static registerType(typeObject) {
    Core.typeRegistry.push(typeObject);
  }
}

export class Node {
  _mounted = false;

  constructor(component, props) {
    this.props = props;
    this.component = component;
  }

  componentDidMount() {}
  componentDidUpdate() {}

  update() {
    const tree = this.render();
    
    this.tree = this.mutateTree(tree);

    if (this !== this.tree) {
      this.tree.update();
    }

    Util.getFlatChildren(this.tree).forEach(child => child.update && child.update());
    
    const dom = this.replaceRoot(this.draw());
    if (!this._mounted) {
      this._mounted = true;
      this.props.ref && this.props.ref(this);
      this.componentDidMount();
    } else {
      this.componentDidUpdate();
    }

    return dom;
  }

  mutateTree(newTree) {
    return Util.getNewTree(this.tree, newTree);
  }

  render() {
    throw new Error('render must be defined by a child class!');
  }

  draw() {
    return this.tree.draw();
  }

  replaceRoot(node) {
    this.root && this.root.parentNode && this.root.parentNode.replaceChild(node, this.root);
    this.root = node;
    return this.root;
  }
  
  getResolvedChildren() {
    const fragment = document.createDocumentFragment();
    Util.getFlatChildren(this).forEach(child => Util.shouldRenderNode(child) && fragment.appendChild(Util.isPrimitive(child) ? document.createTextNode(child) : child.replaceRoot(child.draw())));
    
    return fragment;
  }
}

class FunctionalNode extends Node {
  render() {
    return this.component(this.props);
  }
}

export class StatefulNode extends Node {
  state = {}
    
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update(this.props);
  }
}
