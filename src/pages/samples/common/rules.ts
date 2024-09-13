import { RuleResult } from "../../../validation/rule.ts";

export const nameRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return RuleResult.invalid("name is required");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (0 < subject.length && subject.length < 5) {
      return RuleResult.warning("name may be too short");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (subject.length > 10) {
      return RuleResult.invalid("name is too long");
    }
    return RuleResult.valid;
  },
];
export const emailRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return RuleResult.invalid("email is required");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (subject.length > 0 && !subject.includes("@")) {
      return RuleResult.invalid("email is invalid");
    }
    return RuleResult.valid;
  },
];
export const compositeRules = [
  (subject: { accept: boolean; reason: string }) => {
    if (!subject.accept && subject.reason.length === 0) {
      return RuleResult.invalid("reason is required");
    }
    return RuleResult.valid;
  },
];
export const itemsRules = [
  (subject: { name: string; age: number }[]) => {
    if (subject.length === 0) {
      return RuleResult.invalid("items are required");
    }
    return RuleResult.valid;
  },
  (subject: { name: string; age: number }[]) => {
    if (subject.length > 5) {
      return RuleResult.invalid("items are too many");
    }
    return RuleResult.valid;
  },
];
export const ageRules = [
  (subject: number) => {
    if (subject < 0) {
      return RuleResult.invalid("age is too small");
    }
    return RuleResult.valid;
  },
  (subject: number) => {
    if (subject > 6) {
      return RuleResult.invalid("age is too large");
    }
    return RuleResult.valid;
  },
];
