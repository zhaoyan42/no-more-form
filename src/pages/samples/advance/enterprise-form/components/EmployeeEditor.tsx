import { useMemo, useCallback } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import {
  useValidation,
  validationOptions,
} from "@/validation/hooks/use-validation.ts";
import type { EmployeeEditorProps, Employee } from "../model/types";
import {
  employeeNameRules,
  emailRules,
  salaryRules,
  createEmailUniquenessRules,
} from "../validation/validation-rules";
import { useValidationSetsContext } from "../validation/ValidationSetContext";
import { createValidationGroup } from "../validation/validation-groups";
import "../../../styles/sample-styles.css";

export function EmployeeEditor({
  employee,
  onUpdate,
  allEmployees,
}: EmployeeEditorProps) {
  const { employeeValidationSet } = useValidationSetsContext();
  const nameValidation = useValidation(
    employee.name,
    employeeNameRules,
    validationOptions.withExtra(
      createValidationGroup.employee(
        employee.id,
        `${employee.name} 姓名`,
        employee.department,
      ),
      [employeeValidationSet],
    ),
  );

  const emailValidation = useValidation(
    employee.email,
    emailRules,
    validationOptions.withExtra(
      createValidationGroup.employee(
        employee.id,
        `${employee.name} 邮箱`,
        employee.department,
      ),
      [employeeValidationSet],
    ),
  );

  const salaryValidation = useValidation(
    employee.salary,
    salaryRules,
    validationOptions.withExtra(
      createValidationGroup.employee(
        employee.id,
        `${employee.name} 薪资`,
        employee.department,
      ),
      [employeeValidationSet],
    ),
  );

  // 动态验证规则：检查邮箱唯一性
  const emailUniquenessRules = useMemo(
    () => createEmailUniquenessRules(allEmployees, employee.id),
    [allEmployees, employee.id],
  );
  const emailUniquenessValidation = useValidation(
    employee.email,
    emailUniquenessRules,
    validationOptions.withExtra(
      createValidationGroup.employee(
        employee.id,
        `${employee.name} 邮箱唯一性`,
        employee.department,
      ),
      [employeeValidationSet],
    ),
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
        <div className="sample-field">
          <label className="sample-label">姓名 *</label>
          <input
            type="text"
            className="sample-input"
            value={employee.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={nameValidation.setTouched}
            placeholder="请输入员工姓名"
            style={{
              borderColor: !nameValidation.resultSet.isValid
                ? "#dc3545"
                : undefined,
            }}
          />
          <ValidationMessages validation={nameValidation} />
        </div>

        <div className="sample-field">
          <label className="sample-label">邮箱 *</label>
          <input
            type="email"
            className="sample-input"
            value={employee.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => {
              emailValidation.setTouched();
              emailUniquenessValidation.setTouched();
            }}
            placeholder="请输入邮箱地址"
            style={{
              borderColor:
                !emailValidation.resultSet.isValid ||
                !emailUniquenessValidation.resultSet.isValid
                  ? "#dc3545"
                  : undefined,
            }}
          />
          <ValidationMessages validation={emailValidation} />
          <ValidationMessages validation={emailUniquenessValidation} />
        </div>

        <div className="sample-field">
          <label className="sample-label">部门</label>
          <input
            type="text"
            className="sample-input"
            value={employee.department}
            onChange={(e) => updateField("department", e.target.value)}
            placeholder="所属部门"
          />
        </div>

        <div className="sample-field">
          <label className="sample-label">职位</label>
          <input
            type="text"
            className="sample-input"
            value={employee.role}
            onChange={(e) => updateField("role", e.target.value)}
            placeholder="请输入职位"
          />
        </div>

        <div className="sample-field">
          <label className="sample-label">薪资 *</label>
          <input
            type="number"
            className="sample-input"
            value={employee.salary}
            onChange={(e) => updateField("salary", Number(e.target.value))}
            onBlur={salaryValidation.setTouched}
            placeholder="请输入薪资"
            style={{
              borderColor: !salaryValidation.resultSet.isValid
                ? "#dc3545"
                : undefined,
            }}
          />
          <ValidationMessages validation={salaryValidation} />
        </div>

        <div className="sample-field">
          <label className="sample-label">入职日期</label>
          <input
            type="date"
            className="sample-input"
            value={employee.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </div>
      </div>

      <div className="sample-field" style={{ marginTop: "12px" }}>
        <label className="sample-label">技能 (用逗号分隔)</label>
        <input
          type="text"
          className="sample-input"
          value={employee.skills.join(", ")}
          onChange={(e) =>
            updateField(
              "skills",
              e.target.value.split(",").map((s) => s.trim()),
            )
          }
          placeholder="例如：JavaScript, React, Node.js"
        />
      </div>
    </div>
  );
}
