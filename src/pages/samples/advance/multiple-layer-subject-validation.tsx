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
      <label>Item {index + 1}</label>
      <div>
        <input
          type="text"
          value={name}
          placeholder="input name"
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
        These rules will be validating on items and item's name and age eagerly
        <span style={{ color: "red" }}>in different layers.</span>
        (in this sample the items layer only validate the items length, the item
        layer will validate the name and age of each item separately .)
      </h2>
      <ul>
        <li>name is required (empty : error)</li>
        <li>name may be too short (length less than 5 : warning)</li>
        <li>name is too long (length greater than 10 : error)</li>
        <li>age is too young (less than 0 : error)</li>
        <li>age is too old (greater than 6 : error)</li>
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

      <ValidationMessages validation={itemsValidation} eager />
    </div>
  );
}
