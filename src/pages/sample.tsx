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
  | "即时验证"
  | "变更时验证"
  | "带视觉指示器"
  | "触摸时验证"
  | "分组验证"
  | "复合验证"
  | "动态验证"
  | "多层次验证";
const basicSamples: SampleType[] = [
  "即时验证",
  "变更时验证",
  "带视觉指示器",
  "触摸时验证",
  "分组验证",
];

const advancedSamples: SampleType[] = ["复合验证", "动态验证", "多层次验证"];

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
  const [currentSample, setCurrentSample] = useState<SampleType>("即时验证");

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
        <h2>基础示例</h2>
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

        <h2>高级示例</h2>
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
        <div>{currentSample === "即时验证" && <EagerValidation />}</div>
        <div>{currentSample === "变更时验证" && <OnChangeValidation />}</div>
        <div>{currentSample === "带视觉指示器" && <WithVisualIndicator />}</div>
        <div>{currentSample === "触摸时验证" && <OnTouchValidation />}</div>
        <div>{currentSample === "分组验证" && <GroupedValidation />}</div>
        <div>
          {currentSample === "复合验证" && <CompositeSubjectValidation />}
        </div>
        <div>{currentSample === "动态验证" && <DynamicRulesValidation />}</div>
        <div>
          {currentSample === "多层次验证" && <MultipleLayerSubjectValidation />}
        </div>
      </div>
    </div>
  );
}
