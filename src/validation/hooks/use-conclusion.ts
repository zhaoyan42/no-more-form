import { useMemo } from "react";
import { Validator } from "../validator.ts";
import { ValidateConclusion } from "../conclusion.ts";

export function useConclusion<TSubject>(
  subject: TSubject,
  validator: Validator<TSubject>,
) {
  const conclusion = useMemo(() => {
    const results = validator.validate(subject);
    return new ValidateConclusion(results);
  }, [subject, validator]);

  return { conclusion };
}
