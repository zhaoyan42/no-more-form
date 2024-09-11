type RuleState = "valid" | "warning" | "invalid";

export class RuleResult {
  constructor(
    public state: RuleState,
    public message: string,
  ) {}

  isValid() {
    return this.state === "valid";
  }

  isWarning() {
    return this.state === "warning";
  }

  isInvalid() {
    return this.state === "invalid";
  }

  static valid = new RuleResult("valid", "");
  static warning(message: string) {
    return new RuleResult("warning", message);
  }
  static invalid(message: string) {
    return new RuleResult("invalid", message);
  }
}

export type Rule<TSubject> = (subject: TSubject) => RuleResult;
