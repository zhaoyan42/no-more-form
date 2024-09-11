import { ValidateConclusion } from "./conclusion.ts";

export class Validation {
  constructor(
    public conclusion: ValidateConclusion,
    public visible: boolean,
  ) {}
}
