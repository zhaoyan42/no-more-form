import { useState } from "react";
import { InterruptSubmit } from "./samples/basic/interrupt-submit.tsx";
import { WithVisualIndicator } from "./samples/basic/with-visual-indicator.tsx";
import { OnChangeValidation } from "./samples/basic/on-change-validation.tsx";
import { EagerValidation } from "./samples/basic/eager-validation.tsx";
import { OnTouchValidation } from "./samples/basic/on-touch-validation.tsx";
import { GroupedValidation } from "./samples/basic/grouped-validation.tsx";
import { CompositeSubjectValidation } from "./samples/advance/composite-subject-validation.tsx";
import { DynamicRulesValidation } from "./samples/advance/dynamic-rules-validation.tsx";
import { MultipleLayerSubjectValidation } from "./samples/advance/multiple-layer-subject-validation.tsx";
import { Demo } from "./demo.tsx";

type SampleType =
  | "demo"
  | "eager validation"
  | "on change validation"
  | "with visual indicator"
  | "on touch validation"
  | "grouped validation"
  | "interrupt submit"
  | "composite validation"
  | "dynamic validation"
  | "multiple layer subject";
const basicSamples: SampleType[] = [
  "eager validation",
  "on change validation",
  "with visual indicator",
  "on touch validation",
  "grouped validation",
  "interrupt submit",
];

const advancedSamples: SampleType[] = [
  "composite validation",
  "dynamic validation",
  "multiple layer subject",
];

function Option(props: {
  onClick: () => void;
  sample: SampleType;
  currentSample: SampleType;
}) {
  return (
    <li style={{ cursor: "pointer" }} onClick={props.onClick}>
      {props.sample} {props.sample === props.currentSample && "👈"}
    </li>
  );
}

export function Sample() {
  const [currentSample, setCurrentSample] = useState<SampleType>("demo");

  return (
    <div>
      <h1>Demo</h1>
      <Option
        onClick={() => {
          setCurrentSample("demo");
        }}
        sample={"demo"}
        currentSample={currentSample}
      />
      <h1>Choose a sample:</h1>
      <h2>basic samples</h2>
      <ul>
        {basicSamples.map((sample) => (
          <Option
            key={sample}
            onClick={() => {
              setCurrentSample(sample);
            }}
            sample={sample}
            currentSample={currentSample}
          />
        ))}
      </ul>

      <h2>advanced samples</h2>
      <ul>
        {advancedSamples.map((sample) => (
          <Option
            key={sample}
            onClick={() => {
              setCurrentSample(sample);
            }}
            sample={sample}
            currentSample={currentSample}
          />
        ))}
      </ul>

      <div>{currentSample === "demo" && <Demo />}</div>
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
      <div>{currentSample === "interrupt submit" && <InterruptSubmit />}</div>
      <div>
        {currentSample === "composite validation" && (
          <CompositeSubjectValidation />
        )}
      </div>
      <div>
        {currentSample === "dynamic validation" && <DynamicRulesValidation />}
      </div>
      <div>
        {currentSample === "multiple layer subject" && (
          <MultipleLayerSubjectValidation />
        )}
      </div>
    </div>
  );
}
