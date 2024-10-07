import { useMemo, useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { compositeRules } from "../common/rules.ts";

export function CompositeSubjectValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const subject = useMemo(() => ({ accept, reason }), [accept, reason]);

  const validation = useValidation(subject, compositeRules);

  return (
    <div>
      <h2>
        These rules will be validating on accept and reason eagerly and
        <span style={{ color: "red" }}> compositely</span> (in this sample the
        validation will validate{" "}
        <span style={{ color: "red" }}> composite subject</span> of accept and
        reason by the <span style={{ color: "red" }}> static</span> rules.)
      </h2>

      <ul>
        <li>reason is required when accept not checked (empty : error)</li>
      </ul>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          type="checkbox"
          id="accept"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
        />
        <label htmlFor="accept">accept</label>
      </div>
      <input
        type="text"
        value={reason}
        placeholder="input something"
        onChange={(e) => setReason(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} eager />
    </div>
  );
}
