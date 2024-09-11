import { useState } from "react";
import { ValidationMessages } from "../../validation/components/validation-messages.tsx";
import { RuleResult } from "../../validation/rule.ts";
import { Validator } from "../../validation/validator.ts";
import { useValidation } from "../../validation/hooks/use-validation-states.ts";

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

export function OnTouchValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, validator, {
    eager: false,
    onChange: false,
    onTouch: true,
  });

  const { setTouched } = validation;

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
        onBlur={setTouched}
      />
      <ValidationMessages validation={validation} />
    </div>
  );
}
