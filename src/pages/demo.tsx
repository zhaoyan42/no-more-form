import { useState } from "react";
import { Rule, RuleResult } from "../validation/rule.ts";
import { useValidation } from "../validation/hooks/use-validation-states.ts";
import { ValidationMessages } from "../validation/components/validation-messages.tsx";
import { ValidationSet } from "../validation/validation.ts";
import { useGroupStates } from "../validation/hooks/use-group-states.ts";

export const Demo = () => {
  // State 定义
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);

  // 组状态
  const { groupTouched, setGroupTouched } = useGroupStates();
  const validationSet = new ValidationSet(); // 注意这里不是State

  const nameValidation = useValidation(name, [nameRequired, nameChinese], {
    validationSet,
    groupTouched,
  });
  const emailValidation = useValidation(email, [emailRequired, emailDomain], {
    validationSet,
    groupTouched,
  });
  const countValidation = useValidation(count, [countRange, countOdd], {
    validationSet,
    groupTouched,
  });

  const submit = () => {
    setGroupTouched(true);
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
            nameValidation.setTouched();
          }}
        />
        <ValidationMessages validation={nameValidation} />
      </div>
      <div>
        <label>邮箱:</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            emailValidation.setTouched();
          }}
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
    return RuleResult.warning("警告: live.com 邮箱���能注册失败");
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
