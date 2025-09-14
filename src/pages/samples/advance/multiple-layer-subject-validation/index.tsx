import { useMemo, useState } from "react";
import { ValidationMessages } from "@/validation/components/validation-messages.tsx";
import { ageRules, itemsRules, nameRules } from "../../common/rules.ts";
import { useValidation } from "@/validation/hooks/use-validation.ts";
import { useValidationSet } from "@/validation/hooks/use-validation-set.ts";
import { ValidationSetProvider } from "./components/ValidationSetProvider.tsx";
import { useValidationSetContext } from "./context/ValidationSetContext.ts";
import "../../styles/sample-styles.css";

interface Item {
  name: string;
  age: number;
}

function ItemEditor({
  index,
  item: { age, name },
  onAgeChanged,
  onNameChanged,
  onRemove,
}: {
  index: number;
  item: Item;
  onNameChanged: (value: string) => void;
  onAgeChanged: (value: number) => void;
  onRemove: () => void;
}) {
  // 从Context获取验证集合
  const validationSet = useValidationSetContext();
  const nameValidation = useValidation(name, nameRules, {
    validationSetWriters: useMemo(
      () => [validationSet.writer],
      [validationSet.writer],
    ),
  });
  const ageValidation = useValidation(age, ageRules, {
    validationSetWriters: useMemo(
      () => [validationSet.writer],
      [validationSet.writer],
    ),
  });

  return (
    <div
      className="sample-field"
      style={{
        border: "1px solid #e1e5e9",
        borderRadius: "8px",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h4 style={{ margin: 0, color: "#374151" }}>项目 {index + 1}</h4>
        <button
          onClick={onRemove}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          🗑️ 删除
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 140px",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <div>
          <label className="sample-label" htmlFor={`item-name-${index}`}>
            项目名称
          </label>
          <input
            id={`item-name-${index}`}
            type="text"
            className="sample-input"
            value={name}
            placeholder="请输入项目名称"
            onChange={(e) => onNameChanged(e.target.value)}
            autoComplete="off"
          />
          <ValidationMessages validation={nameValidation} eager />
        </div>

        <div>
          <label className="sample-label">项目年限</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="sample-button"
              onClick={() => onAgeChanged(Math.max(0, age - 1))}
              style={{ padding: "6px 12px", fontSize: "14px" }}
            >
              -
            </button>
            <span
              style={{
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                minWidth: "40px",
                textAlign: "center",
                background: "white",
              }}
            >
              {age}
            </span>
            <button
              className="sample-button"
              onClick={() => onAgeChanged(age + 1)}
              style={{ padding: "6px 12px", fontSize: "14px" }}
            >
              +
            </button>
          </div>
          <ValidationMessages validation={ageValidation} eager />
        </div>
      </div>
    </div>
  );
}

export function MultipleLayerSubjectValidation() {
  const [items, setItems] = useState<Item[]>([]);

  // 创建一个验证集合来收集所有子项目的验证
  const itemValidationSet = useValidationSet();

  // 集合层面的验证
  const itemsValidation = useValidation(items, itemsRules);

  const addItem = () => {
    setItems([...items, { name: "", age: 0 }]);
  };

  const removeItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="sample-container">
      <div className="sample-description">
        <h3>💡 功能说明</h3>
        <p>
          这个示例展示了<span className="sample-highlight">多层验证</span>
          的工作原理。验证系统可以同时对集合层面和元素层面进行验证，实现复杂的嵌套数据验证。
        </p>
        <p>
          适用场景：购物车商品验证、动态表单字段、用户权限管理、配置项管理等需要对动态列表进行验证的场景。
        </p>
      </div>

      <div className="sample-rules">
        <h4>📋 分层验证规则</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <strong>集合层验证：</strong>
            <ul style={{ marginTop: "8px" }}>
              <li>项目列表不能为空（至少需要1个项目）</li>
              <li>项目数量不能超过5个</li>
            </ul>
          </div>
          <div>
            <strong>元素层验证：</strong>
            <ul style={{ marginTop: "8px" }}>
              <li>项目名称为必填项</li>
              <li>名称长度少于5个字符时警告</li>
              <li>名称长度超过10个字符时错误</li>
              <li>项目年限不能为负数</li>
              <li>项目年限不能超过6年</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sample-form">
        <div className="sample-visual-demo">
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <button
              className="sample-button"
              onClick={addItem}
              disabled={items.length >= 5}
            >
              ➕ 添加项目
            </button>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: items.length === 0 ? "#fee2e2" : "#d1fae5",
                color: items.length === 0 ? "#991b1b" : "#065f46",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              项目数量: {items.length}/5
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: itemsValidation.isValid ? "#d1fae5" : "#fee2e2",
                color: itemsValidation.isValid ? "#065f46" : "#991b1b",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              集合验证: {itemsValidation.isValid ? "✅ 通过" : "❌ 失败"}
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: itemValidationSet.result.isValid
                  ? "#d1fae5"
                  : "#fee2e2",
                color: itemValidationSet.result.isValid ? "#065f46" : "#991b1b",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              子项验证:{" "}
              {itemValidationSet.result.isValid ? "✅ 通过" : "❌ 失败"}
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background:
                  itemsValidation.isValid && itemValidationSet.result.isValid
                    ? "#d1fae5"
                    : "#fee2e2",
                color:
                  itemsValidation.isValid && itemValidationSet.result.isValid
                    ? "#065f46"
                    : "#991b1b",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              整体验证:{" "}
              {itemsValidation.isValid && itemValidationSet.result.isValid
                ? "✅ 通过"
                : "❌ 失败"}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <ValidationMessages validation={itemsValidation} eager />
        </div>

        {items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#6b7280",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "2px dashed #d1d5db",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px" }}>
              🎯 点击&quot;添加项目&quot;按钮开始创建项目列表
            </p>
          </div>
        ) : (
          <ValidationSetProvider validationSet={itemValidationSet}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {items.map((item, index) => (
                <ItemEditor
                  key={index}
                  index={index}
                  item={item}
                  onNameChanged={(value) => updateItem(index, "name", value)}
                  onAgeChanged={(value) => updateItem(index, "age", value)}
                  onRemove={() => removeItem(index)}
                />
              ))}
            </div>
          </ValidationSetProvider>
        )}
      </div>
    </div>
  );
}
