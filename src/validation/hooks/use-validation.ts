import type { Rule } from "../rule.ts";
import type { Group } from "./use-group.ts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { RuleSet } from "../rule-set.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import { useFieldStates } from "./use-states.ts";
import { useEffectEvent } from "use-effect-event";
import type { ValidationSet } from "./use-validation-set.ts";

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
    validationSet?: ValidationSet;
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

  const addToSet = useEffectEvent((validation: Validation) => {
    options?.validationSet?.add(id.current, validation);
  });

  useEffect(() => {
    addToSet(validation);
  }, [addToSet, validation]);

  return validation;
}
