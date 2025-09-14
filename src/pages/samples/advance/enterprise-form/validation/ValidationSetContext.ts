import { createContext, useContext } from "react";
import type { ValidationSet } from "@/validation/hooks/use-validation-set";
import type {
  CompanyValidationGroup,
  DepartmentValidationGroup,
  EmployeeValidationGroup,
} from "./validation-groups";

export interface ValidationSetsContextValue {
  companyValidationSet: ValidationSet<CompanyValidationGroup>;
  departmentValidationSet: ValidationSet<DepartmentValidationGroup>;
  employeeValidationSet: ValidationSet<EmployeeValidationGroup>;
}

export const ValidationSetsContext =
  createContext<ValidationSetsContextValue | null>(null);

export function useValidationSetsContext(): ValidationSetsContextValue {
  const ctx = useContext(ValidationSetsContext);
  if (!ctx) throw new Error("ValidationSetsContext not found");
  return ctx;
}
