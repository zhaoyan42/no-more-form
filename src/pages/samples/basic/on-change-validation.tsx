import { useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { nameRules } from "../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";

export function OnChangeValidation() {
  const [name, setName] = useState<string>("");

  const validation = useValidation(name, nameRules);

  return (
    <div>
      <h2>
        这些规则将会对名字进行
        <span style={{ color: "red" }}>修改时触发验证</span>
        （验证会在输入字段更改时显示）
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
      />
      <ValidationMessages validation={validation} onTouch={false} />
    </div>
  );
}
