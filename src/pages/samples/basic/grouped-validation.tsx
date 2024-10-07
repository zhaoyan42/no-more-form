import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";

import { emailRules, nameRules } from "../common/rules.ts";
import { useGroup } from "../../../validation/hooks/use-group.ts";

export function GroupedValidation() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const group = useGroup();

  const nameValidation = useValidation(name, nameRules, {
    eager: false,
    onChange: false,
    onTouch: false,
    group,
  });

  const emailValidation = useValidation(email, emailRules, {
    eager: false,
    onChange: false,
    onTouch: false,
    group,
  });

  return (
    <div>
      <h2>
        These rules will be validating on name and email{" "}
        <span style={{ color: "red" }}>on group touched</span> (in this sample
        the validation will be triggered when the submit button is clicked.)
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

      <button
        onClick={() => {
          group.validate();
        }}
      >
        submit
      </button>
    </div>
  );
}
