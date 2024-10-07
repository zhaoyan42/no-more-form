import { useMemo, useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import type { Rule } from "../../../validation/rule.ts";
import { RuleResult } from "../../../validation/rule.ts";

export function DynamicRulesValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const rules = useMemo(() => {
    const result: Rule<string>[] = [];
    if (!accept) {
      result.push((subject: string) => {
        if (!subject) {
          return RuleResult.invalid(
            "reason is required when accept not checked",
          );
        }
        return RuleResult.valid;
      });
    }
    return result;
  }, [accept]);

  const validation = useValidation(reason, rules);

  return (
    <div>
      <h2>
        These rules will be validating on reason eagerly and{" "}
        <span style={{ color: "red" }}>dynamically</span> (in this sample the
        validation will validate the reason by the{" "}
        <span style={{ color: "red" }}>dynamic</span> rules.)
      </h2>
      <ul>
        <li>reason is required when accept not checked (empty : error)</li>
      </ul>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          type="checkbox"
          id="accept"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
        />
        <label htmlFor="accept">accept</label>
      </div>
      <input
        type="text"
        value={reason}
        placeholder="input something"
        onChange={(e) => setReason(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} eager />
    </div>
  );
}
