import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { nameRules } from "../common/rules.ts";

export function OnTouchValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  const { setTouched } = validation;

  return (
    <div>
      <h2>
        <span style={{ color: "red" }}>被触动后触发验证</span>
        （验证会在输入字段失去焦点时触发）
      </h2>
      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
      </ul>
      <input
        type="text"
        value={name}
        placeholder="输入名字"
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
        onBlur={setTouched}
      />
      <ValidationMessages validation={validation} onChange={false} />
    </div>
  );
}
