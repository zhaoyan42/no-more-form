import { useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import "../styles/sample-styles.css";

export function OnChangeValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">输入时验证</span>
          的工作原理。验证只会在用户实际输入或修改内容时触发，而不是在组件初始化时执行。
        </p>
        <p>
          适用场景：希望减少初始显示错误信息的场景，让用户开始输入后再显示验证结果。
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
          <label className="sample-label" htmlFor="onchange-name">
            用户名字
          </label>
          <input
            id="onchange-name"
            type="text"
            className="sample-input"
            value={name}
            placeholder="开始输入以触发验证"
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="sample-demo-section">
          <ValidationMessages validation={validation} onTouch={false} />
        </div>
      </div>
    </div>
  );
}
