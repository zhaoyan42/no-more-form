import { ValidateConclusion } from "./conclusion.ts";

export interface Validation {
  conclusion: ValidateConclusion;
  visible: boolean;
  setTouched: () => void;
}
