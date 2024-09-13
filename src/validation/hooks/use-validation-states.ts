import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Validation } from "../validation.ts";
import { FieldStates, ValidationStates } from "../states.ts";
import { ValidateConclusion } from "../conclusion.ts";
import { Rule } from "../rule.ts";
import { RuleSet } from "../rule-set.ts";

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
    groupTouched?: boolean;
  } = {
    eager: false,
    onChange: true,
    onTouch: true,
    groupTouched: false,
  },
) {
  const {
    dirty: fieldDirty,
    touched: fieldTouched,
    setTouched: setFieldTouched,
  } = useFieldStates(subject);

  const [visible, setVisible] = useState(options.eager || false);

  const validator = useMemo(() => RuleSet.of(rules), [rules]);

  const getConclusion = useCallback(
    () => new ValidateConclusion(validator.validate(subject)),
    [subject, validator],
  );

  const visibleConclusion = useMemo(() => getConclusion(), [getConclusion]);

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
    if (options.groupTouched) {
      setVisible(true);
    }
  }, [options.groupTouched]);

  return useMemo(
    () =>
      ({
        visibleConclusion,
        visible,
        setTouched,
        getConclusion,
      }) satisfies Validation,
    [visibleConclusion, setTouched, visible, getConclusion],
  );
}
