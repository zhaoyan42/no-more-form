import type { RuleResultSet } from "./rule-result-set.ts";

/**
 * 验证器
 */
export interface Validator {
  getResultSet: () => RuleResultSet;
}
