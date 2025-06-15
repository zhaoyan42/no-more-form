import type { Rule } from "./use-rule-result";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRuleSet } from "./use-rule-set";
import { useRuleResultSet, type RuleResultSet } from "./use-rule-result-set";
import { useFieldState } from "./use-states";
import type { ValidationSet } from "./use-validation-set";

/**
 * 验证
 */
export interface Validation<TExtra = undefined> {
  /** 字段是否被修改 */
  dirty: boolean;
  /** 字段是否被触摸/交互 */
  touched: boolean;
  /** 设置touched状态 */
  setTouched: () => void;
  /** 验证是否通过 */
  isValid: boolean;
  /** 验证结果集合 */
  resultSet: RuleResultSet;
  /** 额外的分组信息 */
  extra: TExtra;
}

/**
 * 验证选项配置
 */
export interface ValidationOptions<TExtra = undefined> {
  /** 额外的分组信息 */
  extra?: TExtra;
  /** 验证集合数组 */
  validationSets?: ValidationSet<unknown>[];
}

// 便捷工具函数
export const validationOptions = {
  /** 创建带有额外分组信息的验证选项 */
  withExtra: <TExtra>(
    extra: TExtra,
    validationSets?: ValidationSet<unknown>[],
  ): ValidationOptions<TExtra> => ({
    extra,
    validationSets,
  }),

  /** 创建只有验证集合的验证选项 */
  withSets: (
    ...validationSets: ValidationSet<unknown>[]
  ): ValidationOptions<undefined> => ({
    validationSets,
  }),
};

/**
 * 使用验证
 * @template TSubject 验证主体的类型
 * @template TExtra 额外分组信息的类型
 * @param {TSubject} subject 验证主体
 * @param {Rule<TSubject>[]} rules 验证规则数组
 * @param {ValidationOptions<TExtra>} [options] 验证选项（可选）
 * @returns 验证状态对象
 */
export function useValidation<TSubject, TExtra = undefined>(
  subject: TSubject,
  rules: Rule<TSubject>[],
  options?: ValidationOptions<TExtra>,
): Validation<TExtra> {
  // 解析选项
  const extra = options?.extra ?? (undefined as TExtra);
  const validationSets = useMemo(
    () => options?.validationSets ?? [],
    [options?.validationSets],
  );

  const {
    dirty: fieldDirty,
    touched: fieldTouched,
    setTouched: setFieldTouched,
  } = useFieldState(subject);

  /** 验证实例的唯一标识 - 使用Symbol确保真正唯一 */
  const idRef = useRef<symbol>();
  if (!idRef.current) {
    idRef.current = Symbol("validation");
  }
  const id = idRef.current;

  /** 验证规则集合 */
  const ruleSet = useRuleSet(rules);

  /** 使用验证结果集合 */
  const resultSet = useRuleResultSet(subject, ruleSet);

  /** 设置touched状态 */
  const setTouched = useCallback(() => {
    setFieldTouched(true);
  }, [setFieldTouched]);

  /** 验证状态对象 */
  const validation = useMemo(
    () =>
      ({
        dirty: fieldDirty,
        touched: fieldTouched,
        setTouched,
        isValid: resultSet.isValid,
        resultSet,
        extra,
      }) satisfies Validation<TExtra> as Validation<TExtra>,
    [fieldDirty, fieldTouched, setTouched, resultSet, extra],
  );

  useEffect(() => {
    // 将验证实例添加到验证集合
    validationSets.forEach((set) =>
      set.add(id, validation as Validation<unknown>),
    );

    return () => {
      // 从验证集合中移除验证实例
      validationSets.forEach((set) => set.remove(id));
    };
  }, [id, validation, validationSets]);

  return validation;
}
