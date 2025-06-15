import { useMemo, useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { compositeRules } from "../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import "../styles/sample-styles.css";

export function CompositeSubjectValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const validation = useValidation(
    useMemo(() => ({ accept, reason }), [accept, reason]),
    compositeRules,
  );

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">组合对象验证</span>
          的工作原理。验证规则可以同时访问多个字段的值，实现复杂的业务逻辑验证。
        </p>
        <p>
          适用场景：字段间有依赖关系的验证，如密码确认、条件必填、业务规则检查等复合验证场景。
        </p>
      </div>

      <div className="sample-rules">
        <h4>📋 验证规则</h4>
        <ul>
          <li>
            <strong>条件必填：</strong>当用户未勾选"接受"时，必须提供拒绝理由
          </li>
          <li>
            <strong>逻辑关联：</strong>验证规则能够同时访问checkbox和输入框的值
          </li>
        </ul>
      </div>

      <div className="sample-form">
        <div className="sample-field">
          <div className="sample-checkbox-wrapper">
            <input
              type="checkbox"
              id="accept"
              className="sample-checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />
            <label htmlFor="accept" className="sample-checkbox-label">
              我接受相关条款和条件
            </label>
          </div>
        </div>

        <div className="sample-field">
          <label className="sample-label" htmlFor="reason">
            拒绝理由 {!accept && <span style={{ color: "#dc2626" }}>*</span>}
          </label>
          <input
            id="reason"
            type="text"
            className="sample-input"
            value={reason}
            placeholder={
              accept ? "已接受条款，无需填写理由" : "请说明拒绝的原因"
            }
            onChange={(e) => setReason(e.target.value)}
            autoComplete="off"
            disabled={accept}
            style={{
              opacity: accept ? 0.6 : 1,
              cursor: accept ? "not-allowed" : "text",
            }}
          />
        </div>

        <div className="sample-visual-demo">
          <h4>🔄 验证状态</h4>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: accept ? "#dbeafe" : "#fef3c7",
                color: accept ? "#1e40af" : "#92400e",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              状态: {accept ? "✅ 已接受" : "⚠️ 未接受"}
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: validation.isValid ? "#d1fae5" : "#fee2e2",
                color: validation.isValid ? "#065f46" : "#991b1b",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              验证: {validation.isValid ? "✅ 通过" : "❌ 失败"}
            </div>
          </div>
        </div>

        <div className="sample-demo-section">
          <ValidationMessages validation={validation} eager />
        </div>
      </div>
    </div>
  );
}
