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

export const sampleEmailValidator = Validator.of<string>()
  .addRule((subject) => {
    if (subject.length === 0) {
      return RuleResult.invalid("email is required");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (subject.length > 0 && !subject.includes("@")) {
      return RuleResult.invalid("email is invalid");
    }
    return RuleResult.valid;
  });

export const sampleCompositeValidator = Validator.of<{
  accept: boolean;
  reason: string;
}>().addRule((subject) => {
  if (!subject.accept && subject.reason.length === 0) {
    return RuleResult.invalid("reason is required");
  }
  return RuleResult.valid;
});

export const sampleItemsValidator = Validator.of<
  {
    name: string;
    age: number;
  }[]
>()
  .addRule((subject) => {
    if (subject.length === 0) {
      return RuleResult.invalid("items are required");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (subject.length > 5) {
      return RuleResult.invalid("items are too many");
    }
    return RuleResult.valid;
  });

export const sampleAgeValidator = Validator.of<number>()
  .addRule((subject) => {
    if (subject < 0) {
      return RuleResult.invalid("age is too small");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (subject > 6) {
      return RuleResult.invalid("age is too large");
    }
    return RuleResult.valid;
  });
