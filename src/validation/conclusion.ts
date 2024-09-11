import { RuleResult } from "./rule.ts";

export class ValidateConclusion {
  constructor(public results: RuleResult[]) {}

  get notValidResults() {
    return this.results.filter((result) => !result.isValid());
  }
}
