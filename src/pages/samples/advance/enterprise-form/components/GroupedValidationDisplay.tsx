import { ValidationMessages } from "@/validation/components/validation-messages";
import type { Validation } from "@/validation/hooks/use-validation";
import { useValidationSetsContext } from "../validation/ValidationSetContext";

export function GroupedValidationDisplay() {
  // 通过 Context 获取验证集合
  const {
    companyValidationSet,
    departmentValidationSet,
    employeeValidationSet,
  } = useValidationSetsContext();

  // 获取不同类型的验证
  const companyValidations = companyValidationSet.getAllValidations();
  const departmentValidations = departmentValidationSet.getAllValidations();
  const employeeValidations = employeeValidationSet.getAllValidations();

  // 只显示有错误的分组
  const hasErrors = (validations: Validation<unknown>[]) =>
    validations.some((v) => !v.isValid);

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>🔍 分组验证详情</h4>

      {hasErrors(companyValidations) && (
        <div
          style={{
            border: "1px solid #dc3545",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "12px",
            backgroundColor: "#fff5f5",
          }}
        >
          <h5 style={{ color: "#dc3545", margin: "0 0 8px 0" }}>
            🏢 公司级验证错误
          </h5>{" "}
          {companyValidations
            .filter((validation) => !validation.isValid)
            .map((validation, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <ValidationMessages validation={validation} eager />
              </div>
            ))}
        </div>
      )}

      {hasErrors(departmentValidations) && (
        <div
          style={{
            border: "1px solid #dc3545",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "12px",
            backgroundColor: "#fff5f5",
          }}
        >
          <h5 style={{ color: "#dc3545", margin: "0 0 8px 0" }}>
            🏬 部门级验证错误
          </h5>{" "}
          {departmentValidations
            .filter((validation) => !validation.isValid)
            .map((validation, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#dc3545",
                  }}
                >
                  部门：{validation.extra.name}
                </div>
                <ValidationMessages validation={validation} eager />
              </div>
            ))}
        </div>
      )}

      {hasErrors(employeeValidations) && (
        <div
          style={{
            border: "1px solid #dc3545",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "12px",
            backgroundColor: "#fff5f5",
          }}
        >
          <h5 style={{ color: "#dc3545", margin: "0 0 8px 0" }}>
            👥 员工级验证错误
          </h5>{" "}
          {employeeValidations
            .filter((validation) => !validation.isValid)
            .map((validation, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#dc3545",
                  }}
                >
                  员工：{validation.extra.name}
                </div>
                <ValidationMessages validation={validation} eager />
              </div>
            ))}
        </div>
      )}

      {!hasErrors(companyValidations) &&
        !hasErrors(departmentValidations) &&
        !hasErrors(employeeValidations) && (
          <p style={{ color: "#28a745", fontWeight: "600" }}>
            ✅ 所有验证都通过了！
          </p>
        )}
    </div>
  );
}
