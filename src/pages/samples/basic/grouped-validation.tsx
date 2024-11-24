import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { emailRules, nameRules } from "../common/rules.ts";
import { useGroup } from "../../../validation/hooks/use-group.ts";
import { useValidation } from "../../../validation/hooks/use-validation.ts";

export function GroupedValidation() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const group = useGroup();

  const nameValidation = useValidation(name, nameRules, { group });

  const emailValidation = useValidation(email, emailRules, { group });

  return (
    <div>
      <h2>
        对若干字段进行
        <span style={{ color: "red" }}>分组手动触发验证</span>
        （两个字段的验证会在点击提交按钮时同时触发）
      </h2>
      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
        <li>电子邮件是必填项（为空：错误）</li>
        <li>电子邮件必须包含@符号（不包含@符号：错误）</li>
      </ul>
      <div>
        名字：
        <input
          type="text"
          value={name}
          placeholder="输入名字"
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={nameValidation} />
      </div>
      <div>
        电子邮件：
        <input
          type="text"
          value={email}
          placeholder="输入电子邮件"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={emailValidation} />
      </div>

      <button
        onClick={() => {
          group.validate();
          if (group.isValid) {
            console.log("表单已提交:", { name, email });
          }
        }}
      >
        提交
      </button>
    </div>
  );
}
