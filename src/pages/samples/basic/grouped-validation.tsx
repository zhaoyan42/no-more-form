import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";

import { useGroupStates } from "../../../validation/hooks/use-group-states.ts";
import { emailRules, nameRules } from "../common/rules.ts";

export function GroupedValidation() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { groupTouched, setGroupTouched } = useGroupStates();

  const nameValidation = useValidation(name, nameRules, {
    eager: false,
    onChange: false,
    onTouch: false,
    groupTouched: groupTouched,
  });

  const emailValidation = useValidation(email, emailRules, {
    eager: false,
    onChange: false,
    onTouch: false,
    groupTouched: groupTouched,
  });

  return (
    <div>
      <h2>
        These rules will be validating on name and email{" "}
        <span style={{ color: "red" }}>on group touched</span>
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
          setGroupTouched(true);
        }}
      >
        submit
      </button>
    </div>
  );
}
