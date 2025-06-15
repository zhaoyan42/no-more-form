import { useMemo } from "react";
import type { Rule, RuleResult } from "./use-rule-result";

export interface RuleSet<TSubject> {
  rules: Rule<TSubject>[];
  validate: (subject: TSubject) => RuleResult[];
}

export function useRuleSet<TSubject>(
  rules: Rule<TSubject>[] = [],
): RuleSet<TSubject> {
  return useMemo(() => {
    const validate = (subject: TSubject): RuleResult[] => {
      return rules.map((rule) => rule(subject));
    };

    return {
      rules,
      validate,
    };
  }, [rules]);
}
