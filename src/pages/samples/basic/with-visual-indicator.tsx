import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useGroup } from "../../../validation/hooks/use-group.ts";
import { useValidation } from "../../../validation/hooks/use-validation.ts";
import { useValidationSet } from "../../../validation/hooks/use-validation-set.ts";

export function WithVisualIndicator() {
  const [name, setName] = useState<string>("");

  const group = useGroup();
  const validationSet = useValidationSet();

  const validation = useValidation(name, nameRules, { validationSet });

  return (
    <div>
      <h2>
        使用验证结果对页面元素进行
        <span style={{ color: "red" }}>视觉提示</span>
        （当验证不通过时，提交按钮将被禁用。）
      </h2>
      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
      </ul>
      <div style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <input
              type="text"
              name="sample"
              value={name}
              placeholder="输入名字"
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            {validation.isValid ? "✅" : "⛔"}
          </div>
          <div>
            <button disabled={!validationSet.isValid}>
              validationSet:{validationSet.isValid ? "可以提交" : "不能提交"}
            </button>
          </div>
        </div>
        <ValidationMessages validation={validation} group={group} />
      </div>
    </div>
  );
}
