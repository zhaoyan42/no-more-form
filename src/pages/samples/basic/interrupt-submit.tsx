import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { ValidationSet } from "../../../validation/validation.ts";

import { emailRules, nameRules } from "../common/rules.ts";

export function InterruptSubmit() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [submitted, setSubmitted] = useState(false);

  const validationSet = new ValidationSet();

  const nameValidation = useValidation(name, nameRules, {
    eager: true,
    validationSet,
  });

  const emailValidation = useValidation(email, emailRules, {
    eager: true,
    validationSet,
  });

  const submit = () => {
    if (!validationSet.valid) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div>
      <h2>
        These rules will be validating on name and email eagerly and will{" "}
        <span style={{ color: "red" }}>interrupt</span> the submit process if
        the validation fails.
      </h2>
      <ul>
        <li>name is required (empty : error)</li>
        <li>name may be too short (length less than 5 : warning)</li>
        <li>name is too long (length greater than 10 : error)</li>
        <li>email is required (empty : error)</li>
        <li>email is has @ (has not @ : error)</li>
      </ul>
      <div>
        name:
        <input
          type="text"
          value={name}
          placeholder="input name"
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={nameValidation} />
      </div>
      <div>
        email:
        <input
          type="text"
          value={email}
          placeholder="input email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={emailValidation} />
      </div>

      <button onClick={submit}>submit</button>

      <span>{submitted ? "submitted" : "submit not allowed"}</span>
    </div>
  );
}
