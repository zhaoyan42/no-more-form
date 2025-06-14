import { useMemo } from "react";

export type RuleState = "valid" | "warning" | "invalid";

export interface RuleResult {
  state: RuleState;
  message: string;
  isValid: boolean;
  isWarning: boolean;
  isInvalid: boolean;
}

export function useRuleResult(state: RuleState, message: string): RuleResult {
  return useMemo(
    () => ({
      state,
      message,
      isValid: state === "valid",
      isWarning: state === "warning",
      isInvalid: state === "invalid",
    }),
    [state, message],
  );
}

// Helper functions to create rule results
export const aRuleResultOf = {
  valid: (): RuleResult => ({
    state: "valid" as const,
    message: "",
    isValid: true,
    isWarning: false,
    isInvalid: false,
  }),
  warning: (message: string): RuleResult => ({
    state: "warning" as const,
    message,
    isValid: false,
    isWarning: true,
    isInvalid: false,
  }),
  invalid: (message: string): RuleResult => ({
    state: "invalid" as const,
    message,
    isValid: false,
    isWarning: false,
    isInvalid: true,
  }),
};

export type Rule<TSubject> = (subject: TSubject) => RuleResult;
