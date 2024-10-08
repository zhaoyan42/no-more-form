import { useState } from "react";
import { WithVisualIndicator } from "./samples/basic/with-visual-indicator.tsx";
import { OnChangeValidation } from "./samples/basic/on-change-validation.tsx";
import { EagerValidation } from "./samples/basic/eager-validation.tsx";
import { OnTouchValidation } from "./samples/basic/on-touch-validation.tsx";
import { GroupedValidation } from "./samples/basic/grouped-validation.tsx";
import { CompositeSubjectValidation } from "./samples/advance/composite-subject-validation.tsx";
import { DynamicRulesValidation } from "./samples/advance/dynamic-rules-validation.tsx";
import { MultipleLayerSubjectValidation } from "./samples/advance/multiple-layer-subject-validation.tsx";

type SampleType =
  | "eager validation"
  | "on change validation"
  | "with visual indicator"
  | "on touch validation"
  | "grouped validation"
  | "composite validation"
  | "dynamic validation"
  | "multiple layer subject";
const basicSamples: SampleType[] = [
  "eager validation",
  "on change validation",
  "with visual indicator",
  "on touch validation",
  "grouped validation",
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
  const [currentSample, setCurrentSample] =
    useState<SampleType>("eager validation");

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <div
        style={{
          flexShrink: "0",
          width: "300px",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
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
      </div>

      <div style={{ flexGrow: "1", padding: "20px" }}>
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
    </div>
  );
}
