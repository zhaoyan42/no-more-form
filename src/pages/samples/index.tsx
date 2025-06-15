import { useState } from "react";
import { EagerValidation } from "./basic/eager-validation";
import { OnChangeValidation } from "./basic/on-change-validation";
import { OnTouchValidation } from "./basic/on-touch-validation";
import { WithVisualIndicator } from "./basic/with-visual-indicator";
import { GroupedValidation } from "./basic/grouped-validation";
import { CompositeSubjectValidation } from "./advance/composite-subject-validation";
import { DynamicRulesValidation } from "./advance/dynamic-rules-validation";
import { MultipleLayerSubjectValidation } from "./advance/multiple-layer-subject-validation";
import "./styles/sample-styles.css";

interface SampleItem {
  id: string;
  title: string;
  description: string;
  category: "basic" | "advanced";
  component: React.ComponentType;
  icon: string;
}

const samples: SampleItem[] = [
  {
    id: "eager-validation",
    title: "即时验证",
    description: "验证会在组件渲染时立即触发，实时反馈输入状态",
    category: "basic",
    component: EagerValidation,
    icon: "⚡",
  },
  {
    id: "on-change-validation",
    title: "输入时验证",
    description: "验证会在用户输入或修改内容时触发，提供即时反馈",
    category: "basic",
    component: OnChangeValidation,
    icon: "✏️",
  },
  {
    id: "on-touch-validation",
    title: "失焦时验证",
    description:
      "验证会在用户离开输入框（失去焦点）时触发，避免输入过程中的干扰",
    category: "basic",
    component: OnTouchValidation,
    icon: "👆",
  },
  {
    id: "with-visual-indicator",
    title: "视觉指示器",
    description: "利用验证结果控制页面元素的视觉状态，提供直观的用户反馈",
    category: "basic",
    component: WithVisualIndicator,
    icon: "🎨",
  },
  {
    id: "grouped-validation",
    title: "分组验证",
    description: "对多个字段进行分组管理，统一触发验证，适用于表单提交场景",
    category: "basic",
    component: GroupedValidation,
    icon: "📋",
  },
  {
    id: "composite-subject-validation",
    title: "组合对象验证",
    description: "对包含多个字段的复合对象进行统一验证，实现字段间的关联逻辑",
    category: "advanced",
    component: CompositeSubjectValidation,
    icon: "🧩",
  },
  {
    id: "dynamic-rules-validation",
    title: "动态规则验证",
    description: "根据应用状态动态生成验证规则集，实现灵活的条件验证逻辑",
    category: "advanced",
    component: DynamicRulesValidation,
    icon: "🔄",
  },
  {
    id: "multiple-layer-subject-validation",
    title: "多层验证",
    description:
      "对嵌套数据结构进行分层验证，同时验证集合本身和集合中的每个元素",
    category: "advanced",
    component: MultipleLayerSubjectValidation,
    icon: "🏗️",
  },
];

export function SamplesIndex() {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<
    "all" | "basic" | "advanced"
  >("all");

  const filteredSamples = samples.filter(
    (sample) => filterCategory === "all" || sample.category === filterCategory,
  );

  const selectedSampleData = samples.find(
    (sample) => sample.id === selectedSample,
  );

  return (
    <div className="samples-layout">
      {/* 左侧导航 */}
      <div className="samples-sidebar">
        <div className="samples-sidebar-header">
          <h1 className="samples-sidebar-title">
            <span className="samples-sidebar-icon">📚</span>
            验证示例
          </h1>
          <p className="samples-sidebar-subtitle">探索各种验证模式和用例</p>
        </div>

        <div className="samples-description">
          <h3>💡 关于示例</h3>
          <p>
            这些示例展示了验证框架的各种功能和使用场景。从基础的单字段验证到复杂的多层验证，
            每个示例都包含详细的说明和交互式演示。
          </p>
        </div>

        <div className="samples-filter">
          <div className="samples-filter-label">筛选：</div>
          <div className="samples-filter-buttons">
            <button
              onClick={() => setFilterCategory("all")}
              className={`samples-filter-button ${
                filterCategory === "all" ? "active" : ""
              }`}
            >
              全部 ({samples.length})
            </button>
            <button
              onClick={() => setFilterCategory("basic")}
              className={`samples-filter-button ${
                filterCategory === "basic" ? "active" : ""
              }`}
            >
              基础 ({samples.filter((s) => s.category === "basic").length})
            </button>
            <button
              onClick={() => setFilterCategory("advanced")}
              className={`samples-filter-button ${
                filterCategory === "advanced" ? "active" : ""
              }`}
            >
              高级 ({samples.filter((s) => s.category === "advanced").length})
            </button>
          </div>
        </div>

        <div className="samples-nav">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => setSelectedSample(sample.id)}
              className={`samples-nav-item ${
                selectedSample === sample.id ? "active" : ""
              }`}
            >
              <div className="samples-nav-item-header">
                <span className="samples-nav-item-icon">{sample.icon}</span>
                <div className="samples-nav-item-info">
                  <h4 className="samples-nav-item-title">{sample.title}</h4>
                  <span
                    className={`sample-badge sample-badge-${sample.category}`}
                  >
                    {sample.category === "basic" ? "基础" : "高级"}
                  </span>
                </div>
              </div>
              <p className="samples-nav-item-description">
                {sample.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="samples-content">
        {selectedSample && selectedSampleData ? (
          <>
            <div className="samples-content-header">
              <div className="samples-content-title">
                <span className="samples-content-icon">
                  {selectedSampleData.icon}
                </span>
                <h2>{selectedSampleData.title}</h2>
                <span
                  className={`sample-badge sample-badge-${selectedSampleData.category}`}
                >
                  {selectedSampleData.category === "basic" ? "基础" : "高级"}
                </span>
              </div>
            </div>
            <div className="samples-content-body">
              <selectedSampleData.component />
            </div>
          </>
        ) : (
          <div className="samples-content-placeholder">
            <div className="samples-content-placeholder-icon">🎯</div>
            <h2>选择一个示例开始体验</h2>
            <p>从左侧导航中选择一个示例，查看详细的演示和代码实现。</p>
          </div>
        )}
      </div>
    </div>
  );
}
