import { RuleResult } from "./rule.ts";

export class ValidateConclusion {
  constructor(public results: RuleResult[]) {}

  get isValid() {
    return this.results.every((result) => !result.isInvalid);
  }

  get notValidResults() {
    return this.results.filter((result) => !result.isValid);
  }
}
