export default function effect(...keys) {
  return function(target, name, descriptor) {
    if (!target._lifecycleCallbacks) {
      target._lifecycleCallbacks = [];

      const update = target.update;

      target.update = function (newProps) {
        const changedProps =
          (newProps &&
            Object.keys(this.props)
              .concat(Object.keys(newProps))
              .reduce((memo, key) => {
                if (newProps[key] !== this.props[key]) {
                  memo.add(key);
                }
                return memo;
              }, new Set(['$all']))) ||
          ['$all'];

        const result = update.apply(this, [newProps]);
        if (this._mounted) {
          this._callbacksToFire = [];
          target._lifecycleCallbacks.forEach(cb => {
            if (
              cb.keys.filter(prop => Array.from(changedProps).includes(prop))
                .length
            ) {
              this._callbacksToFire.push(cb.callback);
            }
          });
        }

        return result;
      };

      const draw = target.draw;

      target.draw = function() {
        const result = draw.apply(this);
        if (!this._mounted) {
          this._mounted = true;
          target._lifecycleCallbacks.map(cb => cb.callback.apply(this));
        } else {
          this._callbacksToFire.forEach(cb => cb.apply(this));
          delete this._callbacksToFire;
        }
        return result;
      }
    }

    target._lifecycleCallbacks.push({ keys, callback: target[name] });

    return descriptor;
  };
}
