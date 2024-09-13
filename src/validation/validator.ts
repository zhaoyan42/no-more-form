import { Rule, RuleResult } from "./rule.ts";

export class Validator<TSubject> {
  private constructor(private rules: Rule<TSubject>[]) {}

  static of<T>(rules: Rule<T>[] = []) {
    return new Validator<T>(rules);
  }

  addRule(rule: Rule<TSubject>) {
    this.rules.push(rule);
    return this;
  }

  addRules(rules: Rule<TSubject>[]) {
    this.rules.push(...rules);
    return this;
  }

  validate(subject: TSubject): RuleResult[] {
    return this.rules.map((rule) => rule(subject));
  }
}
