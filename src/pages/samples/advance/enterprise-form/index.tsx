import { useState, useMemo, useCallback } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { useValidationSet } from "@/validation/hooks/use-validation-set.ts";
import type { Company, Department } from "./model/types";
import { createCompanyValidationRules } from "./validation/validation-rules";
import { DepartmentEditor } from "./components/DepartmentEditor";
import { defaultCompanyData } from "./model/data";
import { ValidationSetContext } from "./validation/ValidationSetContext";

export default function EnterpriseFormValidation() {
  const [company, setCompany] = useState<Company>(defaultCompanyData);

  const companyValidationSet = useValidationSet();

  // 公司级别的验证
  const companyRules = useMemo(() => createCompanyValidationRules(), []);
  const companyValidation = useValidation(
    company,
    companyRules,
    companyValidationSet,
  );

  const updateCompanyField = useCallback(
    <K extends keyof Company>(field: K, value: Company[K]) => {
      setCompany((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addDepartment = useCallback(() => {
    const newDepartment: Department = {
      id: `dept_${Date.now()}`,
      name: "",
      budget: 100000,
      manager: "",
      employees: [],
    };
    updateCompanyField("departments", [...company.departments, newDepartment]);
  }, [company.departments, updateCompanyField]);

  const updateDepartment = useCallback(
    (index: number, department: Department) => {
      const newDepartments = [...company.departments];
      newDepartments[index] = department;
      updateCompanyField("departments", newDepartments);
    },
    [company.departments, updateCompanyField],
  );

  const removeDepartment = useCallback(
    (index: number) => {
      const newDepartments = company.departments.filter((_, i) => i !== index);
      updateCompanyField("departments", newDepartments);
    },
    [company.departments, updateCompanyField],
  );

  const handleSubmit = useCallback(() => {
    // 触发所有验证
    companyValidation.setTouched();

    if (companyValidationSet.isValid) {
      alert("企业信息验证通过，可以提交！");
      console.log("提交的企业数据：", company);
    } else {
      alert("请检查并修复所有验证错误后再提交");
    }
  }, [companyValidation, companyValidationSet.isValid, company]);

  return (
    <ValidationSetContext.Provider value={companyValidationSet}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h1>🏢 企业级多层验证示例</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          这个示例展示了复杂的多层组件结构和灵活的组合验证，包括：
          <br />• 跨组件的数据依赖验证
          <br />• 动态验证规则
          <br />• 多层级的验证状态管理
          <br />• 复杂的业务逻辑验证
        </p>

        <div
          style={{
            border: "3px solid #28a745",
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: "#f8fff9",
          }}
        >
          <h2>公司信息</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label>公司名称 *</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => updateCompanyField("name", e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
              />
            </div>

            <div>
              <label>总预算 *</label>
              <input
                type="number"
                value={company.totalBudget}
                onChange={(e) =>
                  updateCompanyField("totalBudget", Number(e.target.value))
                }
                style={{ width: "100%", padding: "12px", fontSize: "16px" }}
              />
            </div>
          </div>

          {/* 公司级别验证消息 */}
          <div onBlur={companyValidation.setTouched}>
            <ValidationMessages validation={companyValidation} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>部门管理 ({company.departments.length})</h3>
            <button
              onClick={addDepartment}
              style={{
                padding: "12px 24px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              添加部门
            </button>
          </div>

          {company.departments.map((department, index) => (
            <div
              key={department.id}
              style={{ position: "relative", marginBottom: "20px" }}
            >
              <button
                onClick={() => removeDepartment(index)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                删除部门
              </button>
              <DepartmentEditor
                department={department}
                onUpdate={(dept) => updateDepartment(index, dept)}
                company={company}
              />
            </div>
          ))}

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#e9ecef",
              borderRadius: "8px",
            }}
          >
            <h3>公司整体统计</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <strong>部门总数：</strong> {company.departments.length}
              </div>
              <div>
                <strong>员工总数：</strong>{" "}
                {company.departments.reduce(
                  (sum, dept) => sum + dept.employees.length,
                  0,
                )}
              </div>
              <div>
                <strong>预算使用率：</strong>{" "}
                {(
                  (company.departments.reduce(
                    (sum, dept) => sum + dept.budget,
                    0,
                  ) /
                    company.totalBudget) *
                  100
                ).toFixed(1)}
                %
              </div>
              <div>
                <strong>薪资总支出：</strong> ¥
                {company.departments
                  .reduce(
                    (sum, dept) =>
                      sum +
                      dept.employees.reduce(
                        (empSum, emp) => empSum + emp.salary,
                        0,
                      ),
                    0,
                  )
                  .toLocaleString()}
              </div>
              <div>
                <strong>整体验证状态：</strong>{" "}
                {companyValidationSet.isValid
                  ? "✅ 所有数据有效"
                  : "❌ 存在验证错误"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                backgroundColor: companyValidationSet.isValid
                  ? "#007acc"
                  : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: companyValidationSet.isValid
                  ? "pointer"
                  : "not-allowed",
              }}
              disabled={!companyValidationSet.isValid}
            >
              提交企业信息
            </button>
          </div>
        </div>
      </div>
    </ValidationSetContext.Provider>
  );
}
