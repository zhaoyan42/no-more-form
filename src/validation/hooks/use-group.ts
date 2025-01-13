import { useCallback, useMemo, useState } from "react";

/**
 * 分组状态
 */
export interface Group {
  /** 是否已触摸/交互 */
  touched: boolean;
  /** 显示验证结果 */
  showResults: () => void;
}

/**
 * 使用分组状态
 * @returns 包含touched状态和showResults方法的对象
 */
export function useGroup() {
  const [touched, setTouched] = useState(false);

  /**
   * 设置touched为true以显示验证结果
   */
  const showResults = useCallback(() => {
    setTouched(true);
  }, []);

  return useMemo(() => ({
    touched,
    showResults,
  }), [touched, showResults]) satisfies Group as Group;
}
