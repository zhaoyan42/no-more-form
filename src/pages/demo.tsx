import { useState } from "react";
import type { Rule } from "@/validation/hooks/use-rule-result.ts";
import { aRuleResultOf } from "@/validation/hooks/use-rule-result.ts";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { useGroup } from "@/validation/hooks/use-group.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { useValidationSet } from "@/validation/hooks/use-validation-set.ts";

export const Demo = () => {
  // State 定义
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);

  // 组状态
  const group = useGroup();
  const validationSet = useValidationSet();

  const nameValidation = useValidation(
    name,
    [nameRequired, nameChinese],
    validationSet,
  );
  const emailValidation = useValidation(
    email,
    [emailRequired, emailDomain],
    validationSet,
  );
  const countValidation = useValidation(
    count,
    [countRange, countOdd],
    validationSet,
  );

  const submit = () => {
    group.showResults();
    if (validationSet.isValid) {
      console.log("Form submitted:", { name, email, count });
    }
  };

  return (
    <div>
      <div>
        <label>姓名:</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={nameValidation.setTouched}
        />
        <ValidationMessages validation={nameValidation} group={group} />
      </div>
      <div>
        <label>邮箱:</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onBlur={emailValidation.setTouched}
        />
        <ValidationMessages validation={emailValidation} group={group} />
      </div>
      <div>
        <label>计数:</label>
        <button
          type="button"
          onClick={() => {
            const newCount = count - 1;
            setCount(newCount);
          }}
        >
          -
        </button>

        <input
          type="number"
          value={count}
          onChange={(e) => {
            const newCount = parseInt(e.target.value) || 0;
            setCount(newCount);
          }}
          onWheel={(e) => {
            e.preventDefault(); // 阻止页面滚动
            const direction = e.deltaY < 0 ? 1 : -1;
            const newCount = count + direction;
            setCount(newCount);
          }}
          onBlur={countValidation.setTouched}
          style={{ width: "50px", textAlign: "center", margin: "0 8px" }}
        />

        <button
          type="button"
          onClick={() => {
            const newCount = count + 1;
            setCount(newCount);
          }}
        >
          +
        </button>
        <ValidationMessages validation={countValidation} group={group} />
      </div>
      <button type="button" onClick={submit}>
        提交
      </button>
    </div>
  );
};

// Rule 定义
const nameRequired: Rule<string> = (value) => {
  if (!value) return aRuleResultOf.invalid("姓名不能为空");
  return aRuleResultOf.valid();
};

const nameChinese: Rule<string> = (value) => {
  if (!/^[\u4e00-\u9fa5]+$/.test(value))
    return aRuleResultOf.invalid("姓名必须为中文");
  return aRuleResultOf.valid();
};

const emailRequired: Rule<string> = (value) => {
  if (!value) return aRuleResultOf.invalid("Email不能为空");
  return aRuleResultOf.valid();
};

const emailDomain: Rule<string> = (value) => {
  if (/^\S+@(qq\.com|163\.com)$/.test(value)) return aRuleResultOf.valid();
  if (/^\S+@live\.com$/.test(value))
    return aRuleResultOf.warning("警告: live.com 邮箱可能注册失败");
  return aRuleResultOf.invalid("Email 必须是 qq.com 或者 163.com 邮箱");
};

const countRange: Rule<number> = (value) => {
  if (value < 3 || value > 10)
    return aRuleResultOf.invalid("Count 必须在 3 和 10 之间");
  return aRuleResultOf.valid();
};

const countOdd: Rule<number> = (value) => {
  if (value % 2 === 0) return aRuleResultOf.invalid("Count 必须是奇数");
  return aRuleResultOf.valid();
};
