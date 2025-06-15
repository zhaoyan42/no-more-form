import { useCallback, useMemo } from "react";
import type { RuleResult } from "../hooks/use-rule-result";

import type { Validation } from "../hooks/use-validation";
import type { Group } from "../hooks/use-group";

export function ValidationMessages<TExtra = undefined>({
  validation,
  eager,
  onChange,
  onTouch,
  group,
}: {
  validation: Validation<TExtra>;
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
        return {
          color: "#d97706",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          marginBottom: "4px",
        };
      case "invalid":
        return {
          color: "red",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          marginBottom: "4px",
        };
      default:
        return {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          marginBottom: "4px",
        };
    }
  }, []);

  const getIcon = useCallback((result: RuleResult) => {
    switch (result.state) {
      case "warning":
        return "⚠️";
      case "invalid":
        return "❌";
      default:
        return "ℹ️";
    }
  }, []);

  return (
    messageVisible && (
      <>
        {results.map((result, index) => (
          <div key={index} style={getStyles(result)}>
            <span>{getIcon(result)}</span>
            <span>{result.message}</span>
          </div>
        ))}
      </>
    )
  );
}
