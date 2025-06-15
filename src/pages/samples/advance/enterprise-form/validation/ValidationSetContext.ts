import { createContext, useContext } from "react";
import type { ValidationSet } from "@/validation/hooks/use-validation-set";
import type { Company, Department, Employee } from "../model/types";

export interface ValidationSetsContextValue {
  companyValidationSet: ValidationSet<Company>;
  departmentValidationSet: ValidationSet<Department>;
  employeeValidationSet: ValidationSet<Employee>;
}

export const ValidationSetsContext =
  createContext<ValidationSetsContextValue | null>(null);

export function useValidationSetsContext(): ValidationSetsContextValue {
  const ctx = useContext(ValidationSetsContext);
  if (!ctx) throw new Error("ValidationSetsContext not found");
  return ctx;
}
