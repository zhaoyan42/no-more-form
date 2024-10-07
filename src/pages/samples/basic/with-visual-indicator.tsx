import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { nameRules } from "../common/rules.ts";
import { useGroup } from "../../../validation/hooks/use-group.ts";

export function WithVisualIndicator() {
  const [name, setName] = useState<string>("");

  const group = useGroup();

  const validation = useValidation(name, nameRules, { group });

  return (
    <div>
      <h2>
        These rules will be validating on name on change and will show the{" "}
        <span style={{ color: "red" }}>visual indicator</span> (in this sample
        the submit button will be disabled when the validation is not valid.)
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
          <button disabled={!group.isValid()}>
            {group.isValid() ? "can submit" : "can't submit"}
          </button>
        </div>
        <ValidationMessages validation={validation} />
      </div>
    </div>
  );
}
