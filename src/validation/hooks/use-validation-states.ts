import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Validator } from "../validator.ts";
import { useConclusion } from "./use-conclusion.ts";
import { Validation } from "../validation.ts";
import { FieldStates, ValidationStates } from "../states.ts";

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
  validator: Validator<TSubject>,
  options: {
    eager?: boolean;
    onChange?: boolean;
    onTouch?: boolean;
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

  const { conclusion } = useConclusion(subject, validator);

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

  return useMemo(
    () => ({ conclusion, visible, setTouched }) satisfies Validation,
    [conclusion, setTouched, visible],
  );
}
