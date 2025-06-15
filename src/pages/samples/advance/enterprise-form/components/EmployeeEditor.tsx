import { useMemo, useCallback } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import type { EmployeeEditorProps, Employee } from "../model/types";
import {
  employeeNameRules,
  emailRules,
  salaryRules,
  createEmailUniquenessRules,
} from "../validation/validation-rules";
import { useValidationSetContext } from "../validation/ValidationSetContext";

export function EmployeeEditor({
  employee,
  onUpdate,
  allEmployees,
}: EmployeeEditorProps) {
  const validationSet = useValidationSetContext();
  const nameValidation = useValidation(
    employee.name,
    employeeNameRules,
    validationSet,
  );
  const emailValidation = useValidation(
    employee.email,
    emailRules,
    validationSet,
  );
  const salaryValidation = useValidation(
    employee.salary,
    salaryRules,
    validationSet,
  );

  // 动态验证规则：检查邮箱唯一性
  const emailUniquenessRules = useMemo(
    () => createEmailUniquenessRules(allEmployees, employee.id),
    [allEmployees, employee.id],
  );

  const emailUniquenessValidation = useValidation(
    employee.email,
    emailUniquenessRules,
    validationSet,
  );
  const updateField = useCallback(
    <K extends keyof Employee>(field: K, value: Employee[K]) => {
      onUpdate({ ...employee, [field]: value });
    },
    [employee, onUpdate],
  );

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        margin: "8px 0",
        borderRadius: "4px",
        backgroundColor: "#fafafa",
      }}
    >
      <h4>员工信息 - {employee.name || "新员工"}</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label>姓名 *</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={nameValidation.setTouched}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: !nameValidation.resultSet.isValid
                ? "#ff4444"
                : "#ddd",
            }}
          />
          <ValidationMessages validation={nameValidation} />
        </div>

        <div>
          <label>邮箱 *</label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => {
              emailValidation.setTouched();
              emailUniquenessValidation.setTouched();
            }}
            style={{
              width: "100%",
              padding: "8px",
              borderColor:
                !emailValidation.resultSet.isValid ||
                !emailUniquenessValidation.resultSet.isValid
                  ? "#ff4444"
                  : "#ddd",
            }}
          />
          <ValidationMessages validation={emailValidation} />
          <ValidationMessages validation={emailUniquenessValidation} />
        </div>

        <div>
          <label>部门</label>
          <input
            type="text"
            value={employee.department}
            onChange={(e) => updateField("department", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>职位</label>
          <input
            type="text"
            value={employee.role}
            onChange={(e) => updateField("role", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>薪资 *</label>
          <input
            type="number"
            value={employee.salary}
            onChange={(e) => updateField("salary", Number(e.target.value))}
            onBlur={salaryValidation.setTouched}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: !salaryValidation.resultSet.isValid
                ? "#ff4444"
                : "#ddd",
            }}
          />
          <ValidationMessages validation={salaryValidation} />
        </div>

        <div>
          <label>入职日期</label>
          <input
            type="date"
            value={employee.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <label>技能 (用逗号分隔)</label>
        <input
          type="text"
          value={employee.skills.join(", ")}
          onChange={(e) =>
            updateField(
              "skills",
              e.target.value.split(",").map((s) => s.trim()),
            )
          }
          style={{ width: "100%", padding: "8px" }}
          placeholder="例如：JavaScript, React, Node.js"
        />
      </div>
    </div>
  );
}
