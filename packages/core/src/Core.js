import FunctionalNode from './FunctionalNode';
import StatefulNode from './StatefulNode';
import Util from './util';

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