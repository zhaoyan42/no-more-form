import type { Rule } from "../rule.ts";
import type { Group } from "./use-group.ts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { RuleSet } from "../rule-set.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import { useFieldStates } from "./use-states.ts";

export interface Validation {
  dirty: boolean;
  touched: boolean;
  setTouched: () => void;
  isValid: boolean;
  getResultSet: () => RuleResultSet;
}

export function useValidation<TSubject>(
  subject: TSubject,
  rules: Rule<TSubject>[],
  options?: {
    group?: Group;
  },
) {
  const {
    dirty: fieldDirty,
    touched: fieldTouched,
    setTouched: setFieldTouched,
  } = useFieldStates(subject);

  // 生成唯一 ID 保证每个 Validation 实例在Group中的唯一性
  const id = useRef(uuidv4());

  const ruleSet = useMemo(() => RuleSet.of(rules), [rules]);

  const getResultSet = useCallback(
    () => new RuleResultSet(ruleSet.validate(subject)),
    [subject, ruleSet],
  );

  const setTouched = useCallback(() => {
    setFieldTouched(true);
  }, [setFieldTouched]);

  const validation = useMemo(
    () =>
      ({
        dirty: fieldDirty,
        touched: options?.group?.touched || fieldTouched,
        setTouched,
        get isValid() {
          return getResultSet().isValid;
        },
        getResultSet,
      }) satisfies Validation as Validation,
    [
      fieldDirty,
      fieldTouched,
      getResultSet,
      options?.group?.touched,
      setTouched,
    ],
  );

  useEffect(() => {
    // 将当前 Validation 实例添加到 Group 中
    options?.group?.addToGroup(id.current, validation);
  }, [options?.group, validation]);

  return validation;
}
