import FunctionalNode from './FunctionalNode';
import StatefulNode from './StatefulNode';
import Fragment from './Fragment';
import Primitive from './Primitive';
import Util from './util';

export default class Core {
  static Primitive = Primitive;
  static typeRegistry = [
    {
      check: klass => StatefulNode.isPrototypeOf(klass),
      getClass: klass => klass
    },
    {
      check: component =>
        typeof component === 'function' && Object.getPrototypeOf(component) === Object.getPrototypeOf(function() {}),
      getClass: () => FunctionalNode
    },
    {
      check: klass => klass === Fragment,
      getClass: () => Fragment
    }
  ];

  static create(tag, props, ...children) {
    children = children.length === 1 ? children[0] : children;

    for (let type of this.typeRegistry) {
      if (type.check(tag)) {
        const Klass = type.getClass(tag);
        const fullProps = {
          ...Util.cleanProps(props),
          children: Util.getFlatChildren(children).length !== 0 ? children : props && props.children
        };

        return new Klass(tag, fullProps);
      }
    }
  }

  static registerType(typeObject) {
    Core.typeRegistry.push(typeObject);
  }

  static registerPrimitive(primitive) {
    Core.Primitive = primitive;
  }
}
