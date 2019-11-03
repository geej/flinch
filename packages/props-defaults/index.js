import Flinch from "@flinch/core";

// TODO: Improve 'middleware' API
const oldCreate = Flinch.create;

Flinch.create = function(component, props, ...otherArgs) {
  let fullProps = props;

  if (typeof component === "function" && component.defaultProps) {
    fullProps = { ...component.defaultProps, ...props };
  }
  return oldCreate.apply(this, [component, fullProps, ...otherArgs]);
};
