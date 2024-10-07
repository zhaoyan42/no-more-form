import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { nameRules } from "../common/rules.ts";

export function EagerValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  return (
    <div>
      <h2>
        These rules will be validating on name{" "}
        <span style={{ color: "red" }}>eagerly</span> (in this sample the
        validation will be triggered when the component is rendered.)
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
      <ValidationMessages validation={validation} eager />
    </div>
  );
}
