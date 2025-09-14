import { useMemo, useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { emailRules, nameRules } from "../common/rules.ts";
import { useGroup } from "@/validation/hooks/use-group.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { useValidationSet } from "@/validation/hooks/use-validation-set.ts";
import "../styles/sample-styles.css";

export function GroupedValidation() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const group = useGroup();
  const { result: validationSet, writer } = useValidationSet();

  const nameValidation = useValidation(name, nameRules, {
    validationSetWriters: useMemo(() => [writer], [writer]),
  });
  const emailValidation = useValidation(email, emailRules, {
    validationSetWriters: useMemo(() => [writer], [writer]),
  });

  const handleSubmit = () => {
    group.showResults();
    if (validationSet.isValid) {
      alert(`表单提交成功！\n姓名：${name}\n邮箱：${email}`);
      console.log("表单已提交:", { name, email });
    }
  };

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">分组验证</span>
          的工作原理。多个字段可以作为一个验证组，在用户点击提交按钮时统一显示所有验证结果。
        </p>
        <p>
          适用场景：表单提交验证、分步骤表单、需要用户完成所有字段后再显示错误信息的场景。
        </p>
      </div>

      <div className="sample-rules">
        <h4>📋 验证规则</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <strong>姓名字段：</strong>
            <ul style={{ marginTop: "8px" }}>
              <li>不能为空（必填项）</li>
              <li>长度少于5个字符时警告</li>
              <li>长度超过10个字符时错误</li>
            </ul>
          </div>
          <div>
            <strong>邮箱字段：</strong>
            <ul style={{ marginTop: "8px" }}>
              <li>不能为空（必填项）</li>
              <li>必须包含@符号</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sample-form">
        <div className="sample-field">
          <label className="sample-label" htmlFor="grouped-name">
            姓名
          </label>
          <input
            id="grouped-name"
            type="text"
            className="sample-input"
            value={name}
            placeholder="请输入您的姓名"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <ValidationMessages validation={nameValidation} group={group} />
        </div>

        <div className="sample-field">
          <label className="sample-label" htmlFor="grouped-email">
            电子邮箱
          </label>
          <input
            id="grouped-email"
            type="email"
            className="sample-input"
            value={email}
            placeholder="请输入您的邮箱地址"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          <ValidationMessages validation={emailValidation} group={group} />
        </div>

        <div className="sample-demo-section">
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="sample-button" onClick={handleSubmit}>
              📤 提交表单
            </button>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: validationSet.isValid ? "#d1fae5" : "#fee2e2",
                color: validationSet.isValid ? "#065f46" : "#991b1b",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              表单状态: {validationSet.isValid ? "✅ 可提交" : "❌ 有错误"}
            </div>
          </div>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            💡 提示：点击提交按钮查看所有字段的验证结果
          </p>
        </div>
      </div>
    </div>
  );
}
