import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Validation } from "../validation.ts";
import type { FieldStates, ValidationStates } from "../states.ts";
import { RuleResultSet } from "../rule-result-set.ts";
import type { Rule } from "../rule.ts";
import { RuleSet } from "../rule-set.ts";
import type { Group } from "./use-group.ts";

export function useValidationStates(): ValidationStates {
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

export function useFieldStates<T>(subject: T): FieldStates {
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
  options: {
    eager?: boolean;
    onChange?: boolean;
    onTouch?: boolean;
    group?: Group;
  } = {
    eager: false,
    onChange: true,
    onTouch: true,
  },
) {
  const {
    dirty: fieldDirty,
    touched: fieldTouched,
    setTouched: setFieldTouched,
  } = useFieldStates(subject);

  const [visible, setVisible] = useState(options.eager || false);

  const ruleSet = useMemo(() => RuleSet.of(rules), [rules]);

  const getResultSet = useCallback(
    () => new RuleResultSet(ruleSet.validate(subject)),
    [subject, ruleSet],
  );

  const visibleResultSet = useMemo(() => {
    if (!visible) return RuleResultSet.empty;
    return getResultSet();
  }, [getResultSet, visible]);

  const setTouched = useCallback(() => {
    setFieldTouched(true);
  }, [setFieldTouched]);

  useEffect(() => {
    if ((options.onChange === undefined || options.onChange) && fieldDirty) {
      setVisible(true);
    }
  }, [fieldDirty, options.onChange]);

  useEffect(() => {
    if ((options.onTouch === undefined || options.onTouch) && fieldTouched) {
      setVisible(true);
    }
  }, [fieldTouched, options.onTouch]);

  useEffect(() => {
    if (options.group?.touched) {
      setVisible(true);
    }
  }, [options.group?.touched]);

  const validation = useMemo(
    () =>
      ({
        visibleResultSet,
        visible,
        setTouched,
        getResultSet,
      }) satisfies Validation,
    [visibleResultSet, setTouched, visible, getResultSet],
  );

  if (options.group) {
    options.group.addValidation(validation);
  }

  return validation;
}
