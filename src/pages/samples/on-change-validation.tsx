import { useState } from "react";
import { ValidationMessages } from "../../validation/components/validation-messages.tsx";
import { useValidation } from "../../validation/hooks/use-validation.ts";
import { RuleResult } from "../../validation/rule.ts";
import { Validator } from "../../validation/validator.ts";

const validator = Validator.of<string>()
  .addRule((subject) => {
    if (subject.length === 0) {
      return RuleResult.invalid("name is required");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (0 < subject.length && subject.length < 5) {
      return RuleResult.warning("name may be too short");
    }
    return RuleResult.valid;
  })
  .addRule((subject) => {
    if (subject.length > 10) {
      return RuleResult.invalid("name is too long");
    }
    return RuleResult.valid;
  });

export function OnChangeValidation() {
  const [name, setName] = useState<string>("");

  const { conclusion } = useValidation(name, validator);

  return (
    <div>
      <h2>
        These rules will be validating on name{" "}
        <span style={{ color: "red" }}>on change</span>
      </h2>
      <ul>
        <li>name is required (empty : error)</li>
        <li>name may be too short (length less than 5 : warning)</li>
        <li>name is too long (length greater than 10 : error)</li>
      </ul>
      <input
        type="text"
        value={name}
        placeholder="input something"
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages conclusion={conclusion} />
    </div>
  );
}
