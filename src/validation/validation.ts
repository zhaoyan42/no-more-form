import { RuleResultSet } from "./rule-result-set.ts";

export interface Validation {
  visibleResultSet: RuleResultSet;
  visible: boolean;
  setTouched: () => void;
  getResultSet: () => RuleResultSet;
}
