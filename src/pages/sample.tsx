import { useState } from "react";
import { OnChangeValidationWithSubmit } from "./samples/on-change-validation-with-submit.tsx";
import { OnChangeValidation } from "./samples/on-change-validation.tsx";

type SampleType = "on change validation" | "on change validation with submit";

const samples: SampleType[] = [
  "on change validation",
  "on change validation with submit",
];

export function Sample() {
  const [sample, setSample] = useState<SampleType>("on change validation");

  return (
    <div>
      <h1>Choose Samples:</h1>
      <ul>
        {samples.map((sample) => (
          <li
            key={sample}
            onClick={() => {
              setSample(sample);
            }}
          >
            {sample}
          </li>
        ))}
      </ul>

      <div>{sample === "on change validation" && <OnChangeValidation />}</div>
      <div>
        {sample === "on change validation with submit" && (
          <OnChangeValidationWithSubmit />
        )}
      </div>
    </div>
  );
}
