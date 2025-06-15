import { useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import "../styles/sample-styles.css";

export function OnTouchValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  const { setTouched } = validation;

  return (
    <div className="sample-container">
      <div className="sample-header">
        <h1 className="sample-title">
          <span className="sample-title-icon">👆</span>
          失焦时验证
          <span className="sample-badge sample-badge-basic">基础</span>
        </h1>
        <p className="sample-subtitle">
          验证会在用户离开输入框（失去焦点）时触发，避免输入过程中的干扰
        </p>
      </div>

      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">失焦时验证</span>
          的工作原理。验证只会在用户完成输入并离开输入框时触发，不会在输入过程中打断用户。
        </p>
        <p>
          适用场景：需要用户完整输入后再验证的场景，如邮箱地址、身份证号等需要完整信息的字段。
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
          <label className="sample-label" htmlFor="ontouch-name">
            用户名字
          </label>
          <input
            id="ontouch-name"
            type="text"
            className="sample-input"
            value={name}
            placeholder="输入完成后点击其他地方触发验证"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            onBlur={setTouched}
          />
          <small style={{ color: "#666", fontSize: "14px" }}>
            💡 提示：输入内容后，点击输入框外的区域来触发验证
          </small>
        </div>

        <div className="sample-demo-section">
          <ValidationMessages validation={validation} onChange={false} />
        </div>
      </div>
    </div>
  );
}
