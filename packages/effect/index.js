export default function effect(...props) {
  return function(target, name, descriptor) {
    if (!target._lifecycleCallbacks) {
      target._lifecycleCallbacks = [];

      const update = target.update;

      target.update = function(newProps) {
        const changedProps = newProps && Object.keys(this.props).concat(Object.keys(newProps)).reduce((memo, key) => {
          if (newProps[key] !== this.props[key]) {
            memo.add(key);
          }
          return memo;
        }, new Set()) || [];

        const result = update.apply(this, [ newProps ]);
        if (!this._mounted) {
          target._lifecycleCallbacks.map(cb => cb.callback.apply(this));
          this._mounted = true;
        } else {
          target._lifecycleCallbacks.forEach(cb => {
            if (cb.props.filter(prop => Array.from(changedProps).includes(prop)).length) {
              cb.callback.apply(this);
            }
          });
        }

        return result;
      };
    }

    target._lifecycleCallbacks.push({ props, callback: target[name] });

    return descriptor;
  };
}
