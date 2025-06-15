import { useCallback, useMemo } from "react";
import type { RuleResult } from "../hooks/use-rule-result";

import type { Validation } from "../hooks/use-validation";
import type { Group } from "../hooks/use-group";

export function ValidationMessages({
  validation,
  eager,
  onChange,
  onTouch,
  group,
}: {
  validation: Validation;
  eager?: boolean;
  onChange?: boolean;
  onTouch?: boolean;
  group?: Group;
}) {
  eager = eager ?? false;
  onChange = onChange ?? true;
  onTouch = onTouch ?? true;

  const messageVisible =
    eager ||
    (onChange && validation.dirty) ||
    (onTouch && validation.touched) ||
    group?.touched;

  const results = useMemo(
    () => (messageVisible ? validation.resultSet.notValidResults : []),
    [messageVisible, validation],
  );

  const getStyles = useCallback((result: RuleResult) => {
    switch (result.state) {
      case "warning":
        return { color: "yellow" };
      case "invalid":
        return { color: "red" };
      default:
        return {};
    }
  }, []);

  return (
    messageVisible && (
      <>
        {results.map((result, index) => (
          <div key={index} style={getStyles(result)}>
            {result.message}
          </div>
        ))}
      </>
    )
  );
}
