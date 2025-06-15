import { useMemo } from "react";
import type { RuleResult } from "./use-rule-result";
import type { RuleSet } from "./use-rule-set";

export interface RuleResultSet<TExtra = undefined> {
  results: RuleResult[];
  isValid: boolean;
  notValidResults: RuleResult[];
  extra?: TExtra;
}

export function useRuleResultSet<TSubject>(
  subject: TSubject,
  ruleSet: RuleSet<TSubject>,
): RuleResultSet {
  return useMemo(() => {
    const results = ruleSet.validate(subject);
    const isValid = results.every((result) => !result.isInvalid);
    const notValidResults = results.filter((result) => !result.isValid);

    return {
      results,
      isValid,
      notValidResults,
    };
  }, [subject, ruleSet]);
}
