import { Node } from '@flinch/core';

const events = [];
let eventTimeout;

function decorate(valueFn, target, name, descriptor) {
  if (!target._effects) {
    target._effects = [];

    const update = target.update;

    target.update = function(newProps) {
      const result = update.apply(this, [newProps]);

      target._effects.forEach(effect => {
        const newValues = effect.valueFn && effect.valueFn(this.props, this.state, this);
        if (!effect.lastValues || effect.lastValues.some((value, index) => value !== newValues[index])) {
          events.push(() => effect.callback.apply(this));
        }

        effect.lastValues = newValues;
      });

      if (!eventTimeout) {
        eventTimeout = requestAnimationFrame(() => {
          let event;
          while ((event = events.shift())) event();
          eventTimeout = null;
        });
      }

      return result;
    };
  }

  target._effects.push({ valueFn, lastValues: undefined, callback: target[name] });

  return descriptor;
}

export default function effect(...args) {
  if (args[0] && args[0] instanceof Node) {
    return decorate(null, ...args);
  } else {
    return (target, name, descriptor) => decorate(args[0] || (() => [ true ]), target, name, descriptor);
  }
}
