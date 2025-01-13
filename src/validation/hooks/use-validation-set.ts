import { useCallback, useMemo, useState } from "react";
import type { Validation } from "./use-validation.ts";

/**
 * 验证集合
 */
export interface ValidationSet {
  /** 添加验证项 */
  add: (key: string, validation: Validation) => void;
  /** 所有验证项的集合 */
  validations: Record<string, Validation>;
  /** 整个验证集合是否有效 */
  isValid: boolean;
}

/**
 * 使用验证集合
 * @returns 包含验证集合相关方法和状态的对象
 */
export function useValidationSet() {
  const [validations, setValidations] = useState<Record<string, Validation>>(
    {},
  );

  /**
   * 添加新的验证项
   * @param {string} key 验证项的唯一标识
   * @param {Validation} validation 验证项对象
   */
  const add = useCallback((key: string, validation: Validation) => {
    setValidations((prev) => ({
      ...prev,
      [key]: validation,
    }));
  }, []);

  /**
   * 计算并返回验证集合的状态
   * @returns {ValidationSet} 包含验证集合相关方法和状态的对象
   */
  return useMemo(
    () =>
      ({
        add,
        validations: Array.from(Object.entries(validations)).reduce(
          (acc, [key, validation]) => {
            acc[key] = validation;
            return acc;
          },
          {} as Record<string, Validation>,
        ),
        isValid: Object.values(validations).every(
          (validation) => validation.isValid,
        ),
      }) satisfies ValidationSet as ValidationSet,
    [add, validations],
  );
}
