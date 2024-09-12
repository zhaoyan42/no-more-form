import { useState } from "react";
import { WithVisualIndicator } from "./samples/with-visual-indicator.tsx";
import { OnChangeValidation } from "./samples/on-change-validation.tsx";
import { EagerValidation } from "./samples/eager-validation.tsx";
import { OnTouchValidation } from "./samples/on-touch-validation.tsx";
import { GroupedValidation } from "./samples/grouped-validation.tsx";

type SampleType =
  | "eager validation"
  | "on change validation"
  | "with visual indicator"
  | "on touch validation"
  | "grouped validation";
const samples: SampleType[] = [
  "eager validation",
  "on change validation",
  "with visual indicator",
  "on touch validation",
  "grouped validation",
];

export function Sample() {
  const [currentSample, setCurrentSample] =
    useState<SampleType>("eager validation");

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
        {currentSample === "with visual indicator" && <WithVisualIndicator />}
      </div>
      <div>
        {currentSample === "on touch validation" && <OnTouchValidation />}
      </div>
      <div>
        {currentSample === "grouped validation" && <GroupedValidation />}
      </div>
    </div>
  );
}
