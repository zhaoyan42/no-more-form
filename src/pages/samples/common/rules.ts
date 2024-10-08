import { RuleResult } from "../../../validation/rule.ts";

export const nameRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return RuleResult.invalid("名字是必填的");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (0 < subject.length && subject.length < 5) {
      return RuleResult.warning("名字可能太短了");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (subject.length > 10) {
      return RuleResult.invalid("名字太长了");
    }
    return RuleResult.valid;
  },
];
export const emailRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return RuleResult.invalid("电子邮件是必须的");
    }
    return RuleResult.valid;
  },
  (subject: string) => {
    if (subject.length > 0 && !subject.includes("@")) {
      return RuleResult.invalid("电子邮件格式不正确");
    }
    return RuleResult.valid;
  },
];
export const compositeRules = [
  (subject: { accept: boolean; reason: string }) => {
    if (!subject.accept && subject.reason.length === 0) {
      return RuleResult.invalid("拒绝时必须提供原因");
    }
    return RuleResult.valid;
  },
];
export const itemsRules = [
  (subject: { name: string; age: number }[]) => {
    if (subject.length === 0) {
      return RuleResult.invalid("项目至少需要一个");
    }
    return RuleResult.valid;
  },
  (subject: { name: string; age: number }[]) => {
    if (subject.length > 5) {
      return RuleResult.invalid("项目太多了");
    }
    return RuleResult.valid;
  },
];
export const ageRules = [
  (subject: number) => {
    if (subject < 0) {
      return RuleResult.invalid("年龄不能为负数");
    }
    return RuleResult.valid;
  },
  (subject: number) => {
    if (subject > 6) {
      return RuleResult.invalid("年龄太大了");
    }
    return RuleResult.valid;
  },
];
