import { useState } from "react";
import { ImmediateValidation } from "./samples/immediate-validation.tsx";

type SampleType = "immediate validate";

const samples: SampleType[] = ["immediate validate"];

export function Sample() {
  const [sample, setSample] = useState<SampleType>("immediate validate");

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

      <div>{sample === "immediate validate" && <ImmediateValidation />}</div>
    </div>
  );
}
