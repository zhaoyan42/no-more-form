import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Validation } from "../validation.ts";
import type { FieldStates, ValidationStates } from "../states.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import type { Rule } from "../rule.ts";
import { RuleSet } from "../rule-set.ts";
import type { Group } from "./use-group.ts";

function useValidationStates(): ValidationStates {
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  return useMemo(
    () => ({
      dirty,
      setDirty,
      touched,
      setTouched,
    }),
    [dirty, touched],
  );
}

function useFieldStates<T>(subject: T): FieldStates {
  const { dirty, setDirty, touched, setTouched } = useValidationStates();

  const initialState = useRef(subject);

  useEffect(() => {
    if (initialState.current !== subject) {
      setDirty(true);
    }
  }, [setDirty, subject]);

  return {
    dirty,
    touched,
    setTouched,
  } satisfies FieldStates;
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

  if (options?.group) {
    options?.group.addValidation(validation);
  }

  return validation;
}
