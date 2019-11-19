import { StatefulNode } from '@flinch/core';

export default class HookNode extends StatefulNode {
  _effects = {};
  _memos = {};
  _refs = {};

  render() {
    Hooks.setUpdateContext(this);
    return this.component(this.props);
  }

  unmount() {
    Object.keys(this._effects).forEach(key => {
      const fn = this._effects[key].cleanup;
      if (fn) fn();
    });
    super.unmount();
  }
}

const Hooks = {
  setUpdateContext: context => {
    this.context = context;
    this.hookCursor = 0;
  },
  getNextHook: () => {
    this.hookCursor += 1;
    return [this.context, this.hookCursor];
  },
  useState: defaultValue => {
    const [hookContext, hookNumber] = this.getNextHook();

    const setValue = value => {
      hookContext.setState({
        [hookNumber]: value
      });
    };

    return [hookContext.state[hookNumber] || defaultValue, setValue];
  },
  useEffect: (effectFn, firesOn) => {
    const [hookContext, hookNumber] = this.getNextHook();

    if (
      !hookContext._effects[hookNumber] ||
      !firesOn ||
      (firesOn &&
        hookContext._effects[hookNumber].firesOn &&
        firesOn.some((value, index) => value !== hookContext._effects[hookNumber].firesOn[index]))
    ) {
      requestAnimationFrame(() => {
        hookContext._effects[hookNumber] = hookContext._effects[hookNumber] || {};
        hookContext._effects[hookNumber].cleanup = effectFn();
        hookContext._effects[hookNumber].firesOn = firesOn;
      });
    }
  },
  useLayoutEffect: (effectFn, firesOn) => {
    // TODO: Make this fire at the right time
    this.useEffect(effectFn, firesOn);
  },
  useContext: context => {
    // const [ hookContext ] = this.getNextHook();
    // context.findProvider(hookContext);
    // TODO
  },
  useRef: defaultValue => {
    const [hookContext, hookNumber] = this.getNextHook();

    if (!hookContext._refs[hookNumber]) {
      function setRef(ref) {
        setRef.current = ref;
      }

      setRef.current = defaultValue;
      hookContext._refs[hookNumber] = setRef;
    }

    return hookContext._refs[hookNumber];
  },
  useMemo: (fn, changesOn) => {
    const [hookContext, hookNumber] = this.getNextHook();

    if (
      !hookContext._memos[hookNumber] ||
      !changesOn ||
      (changesOn &&
        hookContext._memos[hookNumber].changesOn &&
        changesOn.some((value, index) => value !== hookContext._memos[hookNumber].changesOn[index]))
    ) {
      hookContext._memos[hookNumber] = hookContext._memos[hookNumber] || {};
      hookContext._memos[hookNumber].value = fn();
      hookContext._memos[hookNumber].changesOn = changesOn;
    }

    return hookContext._memos[hookNumber].value;
  },
  useCallback: (fn, changesOn) => {
    return this.useMemo(() => fn, changesOn);
  },
  useReducer: () => {},
  useImperativeHandle: () => {},
  useDebugValue: () => {}
};
