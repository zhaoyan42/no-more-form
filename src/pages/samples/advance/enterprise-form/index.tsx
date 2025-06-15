import { useState, useMemo, useCallback } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { useValidationSet } from "@/validation/hooks/use-validation-set.ts";
import type { Company, Department } from "./model/types";
import { createCompanyValidationRules } from "./validation/validation-rules";
import { DepartmentEditor } from "./components/DepartmentEditor";
import { defaultCompanyData } from "./model/data";
import { ValidationSetContext } from "./validation/ValidationSetContext";
import "../../styles/sample-styles.css";

export function EnterpriseFormValidation() {
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
      <div className="sample-container">
        <div className="sample-description">
          <h3>💡 功能说明</h3>
          <p>
            这个示例展示了
            <span className="sample-highlight">企业级多层验证</span>
            的完整实现。涵盖复杂的业务场景和多层级的数据验证管理。
          </p>
          <p>
            适用场景：大型表单系统、企业级应用、复杂业务流程、多层级数据结构验证等。
          </p>
        </div>

        <div className="sample-rules">
          <h4>📋 验证特性</h4>
          <ul>
            <li>
              <strong>跨组件验证：</strong>不同组件间的数据依赖验证
            </li>
            <li>
              <strong>动态规则：</strong>根据业务状态动态生成验证规则
            </li>
            <li>
              <strong>多层级管理：</strong>公司、部门、员工三级验证状态管理
            </li>
            <li>
              <strong>复杂业务逻辑：</strong>预算分配、薪资核算等业务规则验证
            </li>
          </ul>
        </div>

        <div className="sample-form">
          <h2>公司信息</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="sample-field">
              <label className="sample-label">公司名称 *</label>
              <input
                type="text"
                className="sample-input"
                value={company.name}
                onChange={(e) => updateCompanyField("name", e.target.value)}
                placeholder="请输入公司名称"
              />
            </div>

            <div className="sample-field">
              <label className="sample-label">总预算 *</label>
              <input
                type="number"
                className="sample-input"
                value={company.totalBudget}
                onChange={(e) =>
                  updateCompanyField("totalBudget", Number(e.target.value))
                }
                placeholder="请输入总预算金额"
              />
            </div>
          </div>

          {/* 公司级别验证消息 */}
          <div onBlur={companyValidation.setTouched}>
            <ValidationMessages validation={companyValidation} />
          </div>

          <div className="sample-demo-section">
            <h3>部门管理 ({company.departments.length})</h3>
            <button
              onClick={addDepartment}
              className="sample-button"
              style={{ backgroundColor: "#28a745", marginBottom: "20px" }}
            >
              ➕ 添加部门
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

          <div className="sample-visual-demo">
            <h3>📊 公司整体统计</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#007acc",
                  }}
                >
                  {company.departments.length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>部门总数</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {company.departments.reduce(
                    (sum, dept) => sum + dept.employees.length,
                    0,
                  )}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>员工总数</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
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
                <div style={{ fontSize: "14px", color: "#666" }}>
                  预算使用率
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#dc3545",
                  }}
                >
                  ¥
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
                <div style={{ fontSize: "14px", color: "#666" }}>
                  薪资总支出
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <span
                className={`sample-status-indicator ${
                  companyValidationSet.isValid
                    ? "sample-status-valid"
                    : "sample-status-invalid"
                }`}
              >
                {companyValidationSet.isValid
                  ? "✅ 所有数据验证通过"
                  : "❌ 存在验证错误"}
              </span>
            </div>
          </div>

          <div className="sample-demo-section" style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              className="sample-button"
              disabled={!companyValidationSet.isValid}
              style={{
                backgroundColor: companyValidationSet.isValid
                  ? "#007acc"
                  : "#6c757d",
                fontSize: "18px",
                padding: "16px 32px",
              }}
            >
              🚀 提交企业信息
            </button>
          </div>
        </div>
      </div>
    </ValidationSetContext.Provider>
  );
}
