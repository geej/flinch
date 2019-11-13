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
        const fullProps = {
          ...Util.cleanProps(props),
          children: children && children.length !== 0 ? children : (props && props.children)
        };

        const instance = new Klass(fullProps);

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