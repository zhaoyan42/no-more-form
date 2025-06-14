import { useCallback, useMemo, useState } from "react";
import type { Validation } from "./use-validation.ts";

/**
 * 验证集合
 */
export interface ValidationSet {
  /** 添加验证项 */
  add: (key: symbol, validation: Validation) => void;
  /** 删除验证项 */
  remove: (key: symbol) => void;

  /** 整个验证集合是否有效 */
  isValid: boolean;
}

/**
 * 使用验证集合
 * @returns 包含验证集合相关方法和状态的对象
 */
export function useValidationSet() {
  const [validations, setValidations] = useState<Map<symbol, Validation>>(
    () => new Map(),
  );

  /**
   * 添加新的验证项
   * @param {symbol} key 验证项的唯一标识
   * @param {Validation} validation 验证项对象
   */
  const add = useCallback((key: symbol, validation: Validation) => {
    setValidations((prev) => {
      const next = new Map(prev);
      next.set(key, validation);
      return next;
    });
  }, []);

  /**
   * 删除验证项
   * @param {symbol} key 验证项的唯一标识
   */
  const remove = useCallback((key: symbol) => {
    setValidations((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  /**
   * 整个验证集合是否有效
   */
  const isValid = useMemo(
    () =>
      Array.from(validations.values()).every(
        (validation) => validation.isValid,
      ),
    [validations],
  );

  /**
   * 计算并返回验证集合的状态
   * @returns {ValidationSet} 包含验证集合相关方法和状态的对象
   */
  return useMemo(
    () =>
      ({
        add,
        remove,
        isValid,
      }) satisfies ValidationSet as ValidationSet,
    [add, isValid, remove],
  );
}
