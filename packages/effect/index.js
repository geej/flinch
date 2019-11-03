export default function effect(...props) {
  return function(target, name, descriptor) {
    if (!target._lifecycleCallbacks) {
      target._lifecycleCallbacks = [];

      const update = target.update;

      target.update = function() {
        const result = update.apply(this);

        if (!this._mounted) {
          target._lifecycleCallbacks.map(cb => cb.callback.apply(this));
          this._mounted = true;
        } else {
          // if any of the props have changed, run the callback
        }

        return result;
      };
    }

    target._lifecycleCallbacks.push({ props, callback: target[name] });

    return descriptor;
  };
}
