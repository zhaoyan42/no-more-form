import { useMemo, useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import type { Rule } from "@/validation/hooks/use-rule-result.ts";
import { aRuleResultOf } from "@/validation/hooks/use-rule-result.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import "../styles/sample-styles.css";

export function DynamicRulesValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const dynamicRules = useMemo(() => {
    const result: Rule<string>[] = [];
    if (!accept) {
      result.push((subject: string) => {
        if (!subject) {
          return aRuleResultOf.invalid("当未勾选接受时，理由是必填项");
        }
        if (subject.length < 10) {
          return aRuleResultOf.warning("理由说明建议不少于10个字符");
        }
        return aRuleResultOf.valid();
      });
    }
    return result;
  }, [accept]);

  const validation = useValidation(reason, dynamicRules);

  return (
    <div className="sample-container">
      <div className="sample-header">
        <h1 className="sample-title">
          <span className="sample-title-icon">🔄</span>
          动态规则验证
          <span className="sample-badge sample-badge-advanced">高级</span>
        </h1>
        <p className="sample-subtitle">
          根据应用状态动态生成验证规则集，实现灵活的条件验证逻辑
        </p>
      </div>

      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">动态规则验证</span>
          的工作原理。验证规则可以根据其他字段的状态动态生成，实现复杂的条件验证逻辑。
        </p>
        <p>
          适用场景：多步骤表单、权限相关验证、业务状态驱动的验证规则、A/B测试等需要动态调整验证逻辑的场景。
        </p>
      </div>

      <div className="sample-rules">
        <h4>📋 动态验证规则</h4>
        <div
          style={{
            background: accept ? "#f0f9ff" : "#fffbeb",
            border: `1px solid ${accept ? "#7dd3fc" : "#fbbf24"}`,
            borderRadius: "6px",
            padding: "12px",
            marginTop: "12px",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
            当前激活的规则：
          </p>
          {accept ? (
            <p style={{ margin: 0, color: "#0369a1" }}>
              ✅ 已接受条款 - 无需填写理由，验证规则已禁用
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ color: "#92400e" }}>理由字段为必填项</li>
              <li style={{ color: "#92400e" }}>理由长度建议不少于10个字符</li>
            </ul>
          )}
        </div>
      </div>

      <div className="sample-form">
        <div className="sample-field">
          <div className="sample-checkbox-wrapper">
            <input
              type="checkbox"
              id="dynamic-accept"
              className="sample-checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />
            <label htmlFor="dynamic-accept" className="sample-checkbox-label">
              我接受相关条款和条件
            </label>
          </div>
        </div>

        <div className="sample-field">
          <label className="sample-label" htmlFor="dynamic-reason">
            拒绝理由 {!accept && <span style={{ color: "#dc2626" }}>*</span>}
          </label>
          <input
            id="dynamic-reason"
            type="text"
            className="sample-input"
            value={reason}
            placeholder={
              accept
                ? "已接受条款，无需填写理由"
                : "请详细说明拒绝的原因（建议10字以上）"
            }
            onChange={(e) => setReason(e.target.value)}
            autoComplete="off"
            disabled={accept}
            style={{
              opacity: accept ? 0.6 : 1,
              cursor: accept ? "not-allowed" : "text",
            }}
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            字符数：{reason.length}{" "}
            {!accept && reason.length > 0 && `/ 建议10字以上`}
          </small>
        </div>

        <div className="sample-visual-demo">
          <h4>🎛️ 规则状态监控</h4>
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
              接受状态: {accept ? "✅ 已接受" : "⚠️ 未接受"}
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: dynamicRules.length > 0 ? "#fee2e2" : "#d1fae5",
                color: dynamicRules.length > 0 ? "#991b1b" : "#065f46",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              规则数量: {dynamicRules.length}
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
              验证结果: {validation.isValid ? "✅ 通过" : "❌ 失败"}
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
