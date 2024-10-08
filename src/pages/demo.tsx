import { useState } from "react";
import type { Rule } from "../validation/rule.ts";
import { RuleResult } from "../validation/rule.ts";
import { useValidation } from "../validation/hooks/use-validation-states.ts";
import { ValidationMessages } from "../validation/components/validation-messages.tsx";
import { useGroup } from "../validation/hooks/use-group.ts";

export const Demo = () => {
  // State 定义
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);

  // 组状态
  const group = useGroup();

  const nameValidation = useValidation(name, [nameRequired, nameChinese], {
    group,
  });
  const emailValidation = useValidation(email, [emailRequired, emailDomain], {
    group,
  });
  const countValidation = useValidation(count, [countRange, countOdd], {
    group,
  });

  const submit = () => {
    group.validate();
    if (group.isValid()) {
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
        <ValidationMessages validation={nameValidation} />
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
        <ValidationMessages validation={emailValidation} />
      </div>
      <div>
        <label>计数:</label>
        <button
          type="button"
          onClick={() => {
            const newCount = count - 1;
            setCount(newCount);
            countValidation.setTouched();
          }}
        >
          -
        </button>
        <span>{count}</span>
        <button
          type="button"
          onClick={() => {
            const newCount = count + 1;
            setCount(newCount);
            countValidation.setTouched();
          }}
        >
          +
        </button>
        <ValidationMessages validation={countValidation} />
      </div>
      <button type="button" onClick={submit}>
        提交
      </button>
    </div>
  );
};

// Rule 定义
const nameRequired: Rule<string> = (value) => {
  if (!value) return RuleResult.invalid("姓名不能为空");
  return RuleResult.valid;
};

const nameChinese: Rule<string> = (value) => {
  if (!/^[\u4e00-\u9fa5]+$/.test(value))
    return RuleResult.invalid("姓名必须为中文");
  return RuleResult.valid;
};

const emailRequired: Rule<string> = (value) => {
  if (!value) return RuleResult.invalid("Email不能为空");
  return RuleResult.valid;
};

const emailDomain: Rule<string> = (value) => {
  if (/^\S+@(qq\.com|163\.com)$/.test(value)) return RuleResult.valid;
  if (/^\S+@live\.com$/.test(value))
    return RuleResult.warning("警告: live.com 邮箱可能注册失败");
  return RuleResult.invalid("Email 必须是 qq.com 或者 163.com 邮箱");
};

const countRange: Rule<number> = (value) => {
  if (value < 3 || value > 10)
    return RuleResult.invalid("Count 必须在 3 和 10 之间");
  return RuleResult.valid;
};

const countOdd: Rule<number> = (value) => {
  if (value % 2 === 0) return RuleResult.invalid("Count 必须是奇数");
  return RuleResult.valid;
};
