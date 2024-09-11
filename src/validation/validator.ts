import { Rule, RuleResult } from "./rule.ts";

export class Validator<TSubject> {
  static of<T>() {
    return new Validator<T>();
  }

  private rules: Rule<TSubject>[] = [];

  addRule(rule: Rule<TSubject>) {
    this.rules.push(rule);
    return this;
  }

  validate(subject: TSubject): RuleResult[] {
    return this.rules.map((rule) => rule(subject));
  }
}
