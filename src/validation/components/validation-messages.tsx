import { useCallback, useMemo } from "react";
import type { RuleResult } from "../rule.ts";

import type { Validation } from "../hooks/use-validation.ts";

export function ValidationMessages({
  validation,
  eager,
  onChange,
  onTouch,
}: {
  validation: Validation;
  eager?: boolean;
  onChange?: boolean;
  onTouch?: boolean;
}) {
  eager = eager ?? false;
  onChange = onChange ?? true;
  onTouch = onTouch ?? true;

  const messageVisible =
    eager || (onChange && validation.dirty) || (onTouch && validation.touched);

  const results = useMemo(
    () =>
      messageVisible
        ? validation.getResultSet().results.filter((result) => !result.isValid)
        : [],
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
