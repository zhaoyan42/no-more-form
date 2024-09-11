import { useCallback } from "react";
import { ValidateConclusion } from "../conclusion.ts";
import { RuleResult } from "../rule.ts";

export function ValidationMessages({
  conclusion,
}: {
  conclusion: ValidateConclusion;
}) {
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
    <>
      {conclusion.notValidResults.map((result, index) => (
        <div key={index} style={getStyles(result)}>
          {result.message}
        </div>
      ))}
    </>
  );
}
