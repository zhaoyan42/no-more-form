import { useCallback } from "react";
import { RuleResult } from "../rule.ts";
import { Validation } from "../validation.ts";

export function ValidationMessages({ validation }: { validation: Validation }) {
  const { visibleResultSet, visible } = validation;

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
    visible && (
      <>
        {visibleResultSet.notValidResults.map((result, index) => (
          <div key={index} style={getStyles(result)}>
            {result.message}
          </div>
        ))}
      </>
    )
  );
}
