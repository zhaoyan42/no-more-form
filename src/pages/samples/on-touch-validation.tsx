import { useState } from "react";
import { ValidationMessages } from "../../validation/components/validation-messages.tsx";
import { useValidation } from "../../validation/hooks/use-validation-states.ts";
import { sampleNameValidator } from "./validator/validators.ts";

export function OnTouchValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, sampleNameValidator, {
    eager: false,
    onChange: false,
    onTouch: true,
  });

  const { setTouched } = validation;

  return (
    <div>
      <h2>
        These rules will be validating on name{" "}
        <span style={{ color: "red" }}>on touch</span>
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
