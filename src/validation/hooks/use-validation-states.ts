import { useEffect, useMemo, useRef, useState } from "react";
import { Validator } from "../validator.ts";
import { useConclusion } from "./use-conclusion.ts";
import { Validation } from "../validation.ts";

export function useValidationStates() {
  const [dirty, setDirty] = useState(false);

  return useMemo(
    () => ({
      dirty,
      setDirty,
    }),
    [dirty],
  );
}

export function useFieldStates<T>(subject: T) {
  const { dirty, setDirty } = useValidationStates();

  const initialState = useRef(subject);

  useEffect(() => {
    if (initialState.current !== subject) {
      setDirty(true);
    }
  }, [setDirty, subject]);

  return {
    dirty,
  };
}

export function useValidation<T>(
  subject: T,
  validator: Validator<T>,
  options: {
    eager?: boolean;
    onChange?: boolean;
  } = {
    eager: false,
    onChange: true,
  },
) {
  const { dirty: fieldDirty } = useFieldStates(subject);

  const [visible, setVisible] = useState(options.eager || false);

  const { conclusion } = useConclusion(subject, validator);

  useEffect(() => {
    if ((options.onChange === undefined || options.onChange) && fieldDirty) {
      setVisible(true);
    }
  }, [fieldDirty, options.onChange]);

  return useMemo(
    () => new Validation(conclusion, visible),
    [conclusion, visible],
  );
}
