import { useState } from "react";
import { OnChangeValidationWithSubmit } from "./samples/on-change-validation-with-submit.tsx";
import { OnChangeValidation } from "./samples/on-change-validation.tsx";
import { EagerValidation } from "./samples/eager-validation.tsx";

type SampleType =
  | "eager validation"
  | "on change validation"
  | "on change validation with submit";

const samples: SampleType[] = [
  "eager validation",
  "on change validation",
  "on change validation with submit",
];

export function Sample() {
  const [currentSample, setCurrentSample] = useState<SampleType>(
    "on change validation",
  );

  return (
    <div>
      <h1>Choose Samples:</h1>
      <ul>
        {samples.map((sample) => (
          <li
            style={{ cursor: "pointer" }}
            key={sample}
            onClick={() => {
              setCurrentSample(sample);
            }}
          >
            {sample} {sample === currentSample && "👈"}
          </li>
        ))}
      </ul>

      <div>{currentSample === "eager validation" && <EagerValidation />}</div>
      <div>
        {currentSample === "on change validation" && <OnChangeValidation />}
      </div>
      <div>
        {currentSample === "on change validation with submit" && (
          <OnChangeValidationWithSubmit />
        )}
      </div>
    </div>
  );
}
