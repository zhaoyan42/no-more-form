import { useState } from "react";
import { ValidationMessages } from "../../validation/components/validation-messages.tsx";
import { useValidation } from "../../validation/hooks/use-validation-states.ts";
import { sampleNameValidator } from "./validator/validators.ts";

export function WithVisualIndicator() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, sampleNameValidator, {
    eager: false,
    onChange: true,
    onTouch: false,
  });

  const { conclusion } = validation;

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
      <div>
        <div>
          <input
            type="text"
            name="sample"
            value={name}
            placeholder="input something"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <button disabled={!conclusion.isValid}>
            {conclusion.isValid ? "can submit" : "can't submit"}
          </button>
        </div>
        <ValidationMessages validation={validation} />
      </div>

      <div style={{ paddingTop: "20px" }}></div>

      <div style={{ paddingTop: "20px" }}></div>
    </div>
  );
}
