export interface ValidationStates {
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  touched: boolean;
  setTouched: (touched: boolean) => void;
}

export interface FieldStates {
  dirty: boolean;
  touched: boolean;
  setTouched: (touched: boolean) => void;
}
