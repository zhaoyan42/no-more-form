import { useMemo, useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import type { Rule } from "../../../validation/hooks/use-rule-result.ts";
import { aRuleResultOf } from "../../../validation/hooks/use-rule-result.ts";
import { useValidation } from "../../../validation/hooks/use-validation.ts";

export function DynamicRulesValidation() {
  const [accept, setAccept] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const validation = useValidation(
    reason,
    useMemo(() => {
      const result: Rule<string>[] = [];
      if (!accept) {
        result.push((subject: string) => {
          if (!subject) {
            return aRuleResultOf.invalid("当未勾选接受时，理由是必填项");
          }
          return aRuleResultOf.valid();
        });
      }
      return result;
    }, [accept]),
  );

  return (
    <div>
      <h2>
        <span style={{ color: "red" }}>动态验证</span>
        （在这个示例中，验证将会根据数据不同，通过
        <span style={{ color: "red" }}>动态</span>
        规则对理由进行验证。）
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
