import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useValidation } from "../../../validation/hooks/use-validation.ts";

export function EagerValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  return (
    <div>
      <h2>
        <span style={{ color: "red" }}>即时触发验证</span>
        （验证会在组件渲染时触发）
      </h2>
      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
      </ul>
      <input
        type="text"
        value={name}
        placeholder="输入一些内容"
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} eager />
    </div>
  );
}
