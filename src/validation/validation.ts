import type { RuleResultSet } from "./rule-result-set.ts";

export interface Validation {
  dirty: boolean;
  touched: boolean;
  setTouched: () => void;
  isValid: boolean;
  getResultSet: () => RuleResultSet;
}

export class ValidationSet {
  constructor(private validations: Validation[] = []) {}

  addValidation(validation: Validation) {
    this.validations.push(validation);
  }

  get isValid() {
    return !this.validations.some((validation) => !validation.isValid);
  }
}
