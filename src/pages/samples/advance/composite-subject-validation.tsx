import { useMemo, useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { compositeRules } from "../common/rules.ts";

export function CompositeSubjectValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const validation = useValidation(
    useMemo(() => ({ accept, reason }), [accept, reason]),
    compositeRules,
  );

  return (
    <div>
      <h2>
        <span style={{ color: "red" }}>组合验证</span>
        （在这个示例中，验证将会通过
        <span style={{ color: "red" }}>静态</span>规则对
        <span style={{ color: "red" }}>组合对象</span>进行验证。）
      </h2>

      <ul>
        <li>当未勾选接受时，理由是必填项（为空：错误）</li>
      </ul>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          type="checkbox"
          id="accept"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
        />
        <label htmlFor="accept">接受</label>
      </div>
      <input
        type="text"
        value={reason}
        placeholder="输入内容"
        onChange={(e) => setReason(e.target.value)}
        autoComplete="off"
      />
      <ValidationMessages validation={validation} eager />
    </div>
  );
}
