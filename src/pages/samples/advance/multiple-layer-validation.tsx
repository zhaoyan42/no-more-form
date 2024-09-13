import { useState } from "react";
import { ValidationMessages } from "../../../validation/components/validation-messages.tsx";
import { useValidation } from "../../../validation/hooks/use-validation-states.ts";
import { ageRules, itemsRules, nameRules } from "../validator/rules.ts";

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
  const nameValidation = useValidation(name, nameRules, {
    eager: true,
  });

  const ageValidation = useValidation(age, ageRules, {
    eager: true,
  });

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <label>Item {index + 1}</label>
      <div>
        <input
          type="text"
          value={name}
          placeholder="input name"
          onChange={(e) => onNameChanged(e.target.value)}
          autoComplete="off"
        />
        <ValidationMessages validation={nameValidation} />
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

        <ValidationMessages validation={ageValidation} />
      </div>
    </div>
  );
}

export function MultipleLayerValidation() {
  const [items, setItems] = useState<Item[]>([]);

  const itemsValidation = useValidation(items, itemsRules, {
    eager: true,
  });

  return (
    <div>
      <h2>
        These rules will be validating on items{" "}
        <span style={{ color: "red" }}>eagerly</span>
      </h2>
      <ul>
        <li>reason is required when accept not checked (empty : error)</li>
      </ul>

      <button
        onClick={() => {
          setItems([...items, { name: "", age: 0 }]);
        }}
      >
        Add Item
      </button>
      <button
        onClick={() => {
          const newItems = [...items];
          newItems.pop();
          setItems(newItems);
        }}
      >
        Remove Item
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

      <ValidationMessages validation={itemsValidation} />
    </div>
  );
}
