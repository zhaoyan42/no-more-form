import type { Rule } from "../rule.ts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { RuleSet } from "../rule-set.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import { useFieldState } from "./use-states.ts";
import { useEffectEvent } from "use-effect-event";
import type { ValidationSet } from "./use-validation-set.ts";

export interface Validation {
  dirty: boolean;
  touched: boolean;
  setTouched: () => void;
  isValid: boolean;
  resultSet: RuleResultSet;
}

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

  // 生成唯一 ID 保证每个 Validation 实例在Group中的唯一性
  const id = useRef(uuidv4());

  const ruleSet = useMemo(() => RuleSet.of(rules), [rules]);

  const resultSet = useMemo(
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
        touched: fieldTouched,
        setTouched,
        get isValid() {
          return resultSet.isValid;
        },
        resultSet: resultSet,
      }) satisfies Validation as Validation,
    [fieldDirty, fieldTouched, resultSet, setTouched],
  );

  const addToSet = useEffectEvent((validation: Validation) => {
    options?.validationSet?.add(id.current, validation);
  });

  useEffect(() => {
    addToSet(validation);
  }, [addToSet, validation]);

  return validation;
}
