import { useMemo, useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useGroup } from "@/validation/hooks/use-group.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { ValidationSet } from "@/validation/hooks/use-validation-set.ts";
import "../styles/sample-styles.css";

export function WithVisualIndicator() {
  const [name, setName] = useState<string>("");

  const group = useGroup();
  const {
    result: { isValid },
    writer,
  } = ValidationSet();

  const validation = useValidation(name, nameRules, {
    validationSetWriters: useMemo(() => [writer], [writer]),
  });

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了如何使用
          <span className="sample-highlight">验证结果</span>
          来控制页面元素的视觉状态。通过验证状态，可以动态改变按钮的可用性、显示不同的图标等。
        </p>
        <p>
          适用场景：表单提交控制、实时状态反馈、用户体验优化等需要根据验证结果调整界面的场景。
        </p>
      </div>

      <div className="sample-rules">
        <h4>📋 验证规则</h4>
        <ul>
          <li>
            <strong>必填验证：</strong>名字不能为空（空值时显示错误）
          </li>
          <li>
            <strong>长度警告：</strong>名字长度少于5个字符时显示警告
          </li>
          <li>
            <strong>长度限制：</strong>名字长度超过10个字符时显示错误
          </li>
        </ul>
      </div>

      <div className="sample-form">
        <div className="sample-field">
          <label className="sample-label" htmlFor="visual-name">
            用户名字
          </label>
          <div className="sample-input-group">
            <input
              id="visual-name"
              type="text"
              className="sample-input"
              name="sample"
              value={name}
              placeholder="输入名字查看视觉变化"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            <div
              className={`sample-status-indicator ${validation.isValid ? "sample-status-valid" : "sample-status-invalid"}`}
            >
              {validation.isValid ? "✅ 有效" : "⛔ 无效"}
            </div>
          </div>
        </div>

        <div className="sample-visual-demo">
          <h4>📊 验证状态展示</h4>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="sample-button"
              disabled={!isValid}
              onClick={() => alert("表单提交成功！")}
            >
              {isValid ? "✅ 提交表单" : "❌ 无法提交"}
            </button>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: isValid ? "#d1fae5" : "#fee2e2",
                color: isValid ? "#065f46" : "#991b1b",
                fontWeight: "600",
              }}
            >
              验证集状态: {isValid ? "通过" : "未通过"}
            </div>
          </div>
        </div>

        <div className="sample-demo-section">
          <ValidationMessages validation={validation} group={group} />
        </div>
      </div>
    </div>
  );
}
