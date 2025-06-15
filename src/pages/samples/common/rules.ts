import { aRuleResultOf } from "@/validation/hooks/use-rule-result.ts";

export const nameRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return aRuleResultOf.invalid("名字是必填的");
    }
    return aRuleResultOf.valid();
  },
  (subject: string) => {
    if (0 < subject.length && subject.length < 5) {
      return aRuleResultOf.warning("名字可能太短了");
    }
    return aRuleResultOf.valid();
  },
  (subject: string) => {
    if (subject.length > 10) {
      return aRuleResultOf.invalid("名字太长了");
    }
    return aRuleResultOf.valid();
  },
];
export const emailRules = [
  (subject: string) => {
    if (subject.length === 0) {
      return aRuleResultOf.invalid("电子邮件是必须的");
    }
    return aRuleResultOf.valid();
  },
  (subject: string) => {
    if (subject.length > 0 && !subject.includes("@")) {
      return aRuleResultOf.invalid("电子邮件格式不正确");
    }
    return aRuleResultOf.valid();
  },
];
export const compositeRules = [
  (subject: { accept: boolean; reason: string }) => {
    if (!subject.accept && subject.reason.length === 0) {
      return aRuleResultOf.invalid("拒绝时必须提供原因");
    }
    return aRuleResultOf.valid();
  },
];
export const itemsRules = [
  (subject: { name: string; age: number }[]) => {
    if (subject.length === 0) {
      return aRuleResultOf.invalid("项目至少需要一个");
    }
    return aRuleResultOf.valid();
  },
  (subject: { name: string; age: number }[]) => {
    if (subject.length > 5) {
      return aRuleResultOf.invalid("项目太多了");
    }
    return aRuleResultOf.valid();
  },
];
export const ageRules = [
  (subject: number) => {
    if (subject < 0) {
      return aRuleResultOf.invalid("年龄不能为负数");
    }
    return aRuleResultOf.valid();
  },
  (subject: number) => {
    if (subject > 6) {
      return aRuleResultOf.invalid("年龄太大了");
    }
    return aRuleResultOf.valid();
  },
];
