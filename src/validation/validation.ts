import { ValidateConclusion } from "./conclusion.ts";

export interface Validation {
  visibleConclusion: ValidateConclusion;
  visible: boolean;
  setTouched: () => void;
  getConclusion: () => ValidateConclusion;
}
