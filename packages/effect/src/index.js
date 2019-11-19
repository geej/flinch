import { Node } from '@flinch/core';

const events = [];
let eventTimeout;

function forEachEffectPushIf(context, target, matchFn) {
  target._effects.forEach(effect => {
    const lastValues = effect.values;
    const newValues = effect.valueFn && effect.valueFn(context.props, context.state, context);
    if (matchFn(lastValues, newValues)) {
      effect.values = newValues;
      events.push(() => effect.callback.apply(context, lastValues));
    }
  });
}

function decorate(valueFn, target, name, descriptor) {
  if (!target._effects) {
    target._effects = [];

    const update = target.update;

    target.update = function(newProps) {
      // Component did update
      forEachEffectPushIf(
        this,
        target,
        (lastValues, newValues) => lastValues && lastValues.some((value, index) => value !== newValues[index])
      );

      const result = update.apply(this, [newProps]);

      // Component did mount
      forEachEffectPushIf(this, target, lastValues => !lastValues);

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

  target._effects.push({ valueFn, values: undefined, callback: target[name] });

  return descriptor;
}

export default function effect(...args) {
  if (args[0] && args[0] instanceof Node) {
    return decorate(null, ...args);
  } else {
    return (target, name, descriptor) => decorate(args[0] || (() => [true]), target, name, descriptor);
  }
}
