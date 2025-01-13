import type { Rule } from "../rule.ts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { RuleSet } from "../rule-set.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import { useFieldState } from "./use-states.ts";
import { useEffectEvent } from "use-effect-event";
import type { ValidationSet } from "./use-validation-set.ts";

/**
 * 验证状态接口
 */
export interface Validation {
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
}

/**
 * 管理验证逻辑的hook
 * @template TSubject 验证主体的类型
 * @param {TSubject} subject 验证主体
 * @param {Rule<TSubject>[]} rules 验证规则数组
 * @param {Object} [options] 可选配置
 * @param {ValidationSet} [options.validationSet] 验证集合
 * @returns {Validation} 验证状态对象
 */
export function useValidation<TSubject>(
  subject: TSubject,
  rules: Rule<TSubject>[],
  options?: {
    validationSet?: ValidationSet;
  },
) {
  const {
    dirty: fieldDirty,
    touched: fieldTouched,
    setTouched: setFieldTouched,
  } = useFieldState(subject);

  /** 验证实例的唯一标识 */
  const id = useRef(uuidv4());

  /** 验证规则集合 */
  const ruleSet = useMemo(() => RuleSet.of(rules), [rules]);

  /** 验证结果集合 */
  const resultSet = useMemo(
    () => new RuleResultSet(ruleSet.validate(subject)),
    [subject, ruleSet],
  );

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
        get isValid() {
          return resultSet.isValid;
        },
        resultSet: resultSet,
      }) satisfies Validation as Validation,
    [fieldDirty, fieldTouched, resultSet, setTouched],
  );

  /** 将验证实例添加到验证集合 */
  const addToSet = useEffectEvent((validation: Validation) => {
    options?.validationSet?.add(id.current, validation);
  });

  useEffect(() => {
    addToSet(validation);
  }, [addToSet, validation]);

  return validation;
}
