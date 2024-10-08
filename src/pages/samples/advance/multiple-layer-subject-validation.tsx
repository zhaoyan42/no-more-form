import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { ageRules, itemsRules, nameRules } from "../common/rules.ts";

interface Item {
  name: string;
  age: number;
}

function ItemEditor({
  index,
  item: { age, name },
  onAgeChanged,
  onNameChanged,
}: {
  index: number;
  item: Item;
  onNameChanged: (value: string) => void;
  onAgeChanged: (value: number) => void;
}) {
  const nameValidation = useValidation(name, nameRules);

  const ageValidation = useValidation(age, ageRules);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <label>项目 {index + 1}</label>
      <div>
        <input
          type="text"
          value={name}
          placeholder="输入名字"
          onChange={(e) => onNameChanged(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={nameValidation} eager />
      </div>
      <div>
        <button
          onClick={() => {
            onAgeChanged(age + 1);
          }}
        >
          +
        </button>
        <span>{age}</span>
        <button
          onClick={() => {
            onAgeChanged(age - 1);
          }}
        >
          -
        </button>

        <ValidationMessages validation={ageValidation} eager />
      </div>
    </div>
  );
}

export function MultipleLayerSubjectValidation() {
  const [items, setItems] = useState<Item[]>([]);

  const itemsValidation = useValidation(items, itemsRules);

  return (
    <div>
      <h2>
        这些规则将会对项目及项目的名字和年龄进行
        <span style={{ color: "red" }}>分层验证</span>
        验证（在这个示例中，项目集合层只验证项目的数量，项目层将分别验证每个项目的名字和年龄。）
      </h2>
      <ul>
        <li>项目必填（长度为0：错误）</li>
      </ul>
      <ul>
        <li>名字是必填项（为空：错误）</li>
        <li>名字可能太短（长度小于5：警告）</li>
        <li>名字太长（长度大于10：错误）</li>
        <li>年龄太小（小于0：错误）</li>
        <li>年龄太大（大于6：错误）</li>
      </ul>

      <button
        onClick={() => {
          setItems([...items, { name: "", age: 0 }]);
        }}
      >
        添加项目
      </button>
      <button
        onClick={() => {
          const newItems = [...items];
          newItems.pop();
          setItems(newItems);
        }}
      >
        移除项目
      </button>
      {items.map((item, index) => (
        <ItemEditor
          key={index}
          index={index}
          item={item}
          onNameChanged={(value) => {
            const newItems = [...items];
            newItems[index].name = value;
            setItems(newItems);
          }}
          onAgeChanged={(value) => {
            const newItems = [...items];
            newItems[index].age = value;
            setItems(newItems);
          }}
        />
      ))}

      <ValidationMessages validation={itemsValidation} eager />
    </div>
  );
}
