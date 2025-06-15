import { useMemo, useCallback } from "react";
import { ValidationMessages } from "../../../../../validation/components/validation-messages";
import { useValidation } from "../../../../../validation/hooks/use-validation";
import { useValidationSet } from "../../../../../validation/hooks/use-validation-set";
import type {
  DepartmentEditorProps,
  Department,
  Employee,
} from "../model/types";
import {
  departmentBudgetRules,
  createDepartmentValidationRules,
} from "../validation/validation-rules";
import { EmployeeEditor } from "./EmployeeEditor";
import { useValidationSetContext } from "../validation/ValidationSetContext";

export function DepartmentEditor({
  department,
  onUpdate,
  company,
}: DepartmentEditorProps) {
  const validationSet = useValidationSetContext();
  const departmentValidationSet = useValidationSet();
  const budgetValidation = useValidation(
    department.budget,
    departmentBudgetRules,
    validationSet,
    departmentValidationSet,
  );

  // 部门级别的复合验证
  const departmentRules = useMemo(() => createDepartmentValidationRules(), []);

  const departmentValidation = useValidation(
    department,
    departmentRules,
    validationSet,
    departmentValidationSet,
  );

  const updateField = useCallback(
    <K extends keyof Department>(field: K, value: Department[K]) => {
      onUpdate({ ...department, [field]: value });
    },
    [department, onUpdate],
  );

  const addEmployee = useCallback(() => {
    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      name: "",
      email: "",
      department: department.name,
      role: "",
      salary: 5000,
      startDate: new Date().toISOString().split("T")[0],
      skills: [],
    };
    updateField("employees", [...department.employees, newEmployee]);
  }, [department, updateField]);

  const updateEmployee = useCallback(
    (index: number, employee: Employee) => {
      const newEmployees = [...department.employees];
      newEmployees[index] = employee;
      updateField("employees", newEmployees);
    },
    [department.employees, updateField],
  );

  const removeEmployee = useCallback(
    (index: number) => {
      const newEmployees = department.employees.filter((_, i) => i !== index);
      updateField("employees", newEmployees);
    },
    [department.employees, updateField],
  );

  // 获取所有员工用于跨部门验证
  const allEmployees = useMemo(
    () => company.departments.flatMap((dept) => dept.employees),
    [company.departments],
  );

  return (
    <div
      style={{
        border: "2px solid #007acc",
        padding: "20px",
        margin: "16px 0",
        borderRadius: "8px",
        backgroundColor: "#f0f8ff",
      }}
    >
      <h3>部门：{department.name || "新部门"}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>部门名称 *</label>
          <input
            type="text"
            value={department.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>预算 *</label>
          <input
            type="number"
            value={department.budget}
            onChange={(e) => updateField("budget", Number(e.target.value))}
            onBlur={budgetValidation.setTouched}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: !budgetValidation.resultSet.isValid
                ? "#ff4444"
                : "#ddd",
            }}
          />
          <ValidationMessages validation={budgetValidation} />
        </div>

        <div>
          <label>部门管理者</label>
          <select
            value={department.manager}
            onChange={(e) => updateField("manager", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">选择管理者</option>
            {department.employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 部门级别验证消息 */}
      <div onBlur={departmentValidation.setTouched}>
        <ValidationMessages validation={departmentValidation} />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h4>员工列表 ({department.employees.length})</h4>
        <button
          onClick={addEmployee}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          添加员工
        </button>
      </div>

      {department.employees.map((employee, index) => (
        <div key={employee.id} style={{ position: "relative" }}>
          <button
            onClick={() => removeEmployee(index)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            ×
          </button>
          <EmployeeEditor
            employee={employee}
            onUpdate={(emp) => updateEmployee(index, emp)}
            allEmployees={allEmployees}
          />
        </div>
      ))}

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#e8f4fd",
          borderRadius: "4px",
        }}
      >
        <strong>部门统计：</strong>
        <br />
        员工总数：{department.employees.length} 人
        <br />
        薪资总支出：¥
        {department.employees
          .reduce((sum, emp) => sum + emp.salary, 0)
          .toLocaleString()}
        <br />
        预算余额：¥
        {(
          department.budget -
          department.employees.reduce((sum, emp) => sum + emp.salary, 0)
        ).toLocaleString()}
        <br />
        验证状态：{departmentValidationSet.isValid ? "✅ 有效" : "❌ 无效"}
      </div>
    </div>
  );
}
