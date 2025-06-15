import { useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import "../styles/sample-styles.css";

export function EagerValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">即时验证</span>
          的工作原理。验证规则会在组件初始化时就开始执行，并随着用户输入实时更新验证结果。
        </p>
        <p>
          适用场景：需要实时反馈的表单字段，如密码强度检查、用户名可用性验证等。
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
          <label className="sample-label" htmlFor="eager-name">
            用户名字
          </label>
          <input
            id="eager-name"
            type="text"
            className="sample-input"
            value={name}
            placeholder="请输入您的名字"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="sample-demo-section">
          <ValidationMessages validation={validation} eager />
        </div>
      </div>
    </div>
  );
}
