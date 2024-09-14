import { RuleResultSet } from "./rule-result-set.ts";

export interface Validation {
  visibleResultSet: RuleResultSet;
  visible: boolean;
  setTouched: () => void;
  getResultSet: () => RuleResultSet;
}

export class ValidationSet {
  constructor(private validations: Validation[] = []) {}

  addValidation(validation: Validation) {
    this.validations.push(validation);
  }

  get valid() {
    return !this.validations.some(
      (validation) => !validation.visibleResultSet.isValid,
    );
  }
}
