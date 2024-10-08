import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { useGroup } from "../../../validation/hooks/use-group.ts";
import { nameRules, emailRules } from "../common/rules.ts";
import type { Validation } from "../../../validation/validation.ts";

function NameTab({
  validation,
  value,
  onChange,
}: {
  validation: Validation;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder="输入名字"
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} />
    </div>
  );
}

function EmailTab({
  validation,
  value,
  onChange,
}: {
  validation: Validation;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder="输入电子邮件"
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} />
    </div>
  );
}

export function NoRenderValidation() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const group = useGroup();

  const nameValidation = useValidation(name, nameRules, { group });
  const emailValidation = useValidation(email, emailRules, { group });

  return (
    <div>
      <h2>
        这个示例展示了如何在<span style={{ color: "red" }}>不渲染元素</span>
        的情况下进行验证。（切换标签时，验证会在后台进行，即使元素没有渲染出来。）
      </h2>

      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
        <li>电子邮件是必填项（为空：错误）</li>
        <li>电子邮件格式不正确（不符合格式：错误）</li>
      </ul>

      <div>
        <button onClick={() => setActiveTab(0)}>Tab 1</button>
        <button onClick={() => setActiveTab(1)}>Tab 2</button>
      </div>
      <div>
        {activeTab === 0 && (
          <NameTab
            value={name}
            onChange={setName}
            validation={nameValidation}
          />
        )}
        {activeTab === 1 && (
          <EmailTab
            value={email}
            onChange={setEmail}
            validation={emailValidation}
          />
        )}
      </div>
      <button
        onClick={() => {
          group.validate();
          if (group.isValid) {
            console.log("表单已提交");
          }
        }}
      >
        提交
      </button>
    </div>
  );
}
