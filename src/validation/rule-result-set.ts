import type { RuleResult } from "./rule.ts";

export class RuleResultSet {
  constructor(public results: RuleResult[]) {}

  get isValid() {
    return this.results.every((result) => !result.isInvalid);
  }

  get notValidResults() {
    return this.results.filter((result) => !result.isValid);
  }

  static empty = new RuleResultSet([]);
}
