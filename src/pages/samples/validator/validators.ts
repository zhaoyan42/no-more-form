import { Validator } from "../../../validation/validator.ts";
import { RuleResult } from "../../../validation/rule.ts";

export const sampleNameValidator = Validator.of<string>()
  .addRule((subject) => {
    if (subject.length === 0) {
      return RuleResult.invalid("name is required");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (0 < subject.length && subject.length < 5) {
      return RuleResult.warning("name may be too short");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (subject.length > 10) {
      return RuleResult.invalid("name is too long");
    }
    return RuleResult.valid;
  });
