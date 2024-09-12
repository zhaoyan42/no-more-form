import { useState } from "react";
import { ValidationMessages } from "../../validation/components/validation-messages.tsx";
import { useValidation } from "../../validation/hooks/use-validation-states.ts";
import { sampleNameValidator } from "./validator/validators.ts";

export function OnChangeValidationWithSubmit() {
  const [name, setName] = useState<string>("");

  const [submitState, setSubmitState] = useState<boolean | null>(null);

  const validation = useValidation(name, sampleNameValidator, {
    eager: false,
    onChange: true,
    onTouch: false,
  });

  const { conclusion } = validation;

  const submit = () => {
    if (conclusion.isValid) {
      setSubmitState(true);
    } else {
      setSubmitState(false);
    }
  };

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
        <input
          type="text"
          name="sample"
          value={name}
          placeholder="input something"
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={validation} />
      </div>

      <div style={{ paddingTop: "20px" }}>
        <button onClick={submit}>submit</button>

        <button onClick={submit} disabled={!conclusion.isValid}>
          button with disabled :{" "}
          {conclusion.isValid ? "can submit" : "can't submit"}
        </button>

        {submitState !== null && (
          <div>{submitState ? "submit success" : "submit failed"}</div>
        )}
      </div>

      <div style={{ paddingTop: "20px" }}></div>
    </div>
  );
}
