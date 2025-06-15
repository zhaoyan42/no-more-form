import { useCallback, useMemo, useState } from "react";
import type { Validation } from "./use-validation";

/**
 * 验证集合
 */
export interface ValidationSet<TExtra = unknown> {
  /** 添加验证项 */ add: (key: symbol, validation: Validation<unknown>) => void;
  /** 删除验证项 */
  remove: (key: symbol) => void;
  /** 整个验证集合是否有效 */
  isValid: boolean;
  /** 获取所有验证项 */
  getAllValidations: () => Array<Validation<TExtra>>;
  /** 根据额外信息过滤验证项 */
  getValidationsByExtra?: <T extends TExtra>(
    predicate: (extra: TExtra) => extra is T,
  ) => Array<Validation<T>>;
}

/**
 * 使用验证集合
 * @returns 包含验证集合相关方法和状态的对象
 */
export function useValidationSet<TExtra = unknown>(): ValidationSet<TExtra> {
  const [validations, setValidations] = useState<
    Map<symbol, Validation<TExtra>>
  >(() => new Map());

  /**
   * 添加新的验证项
   * @param {symbol} key 验证项的唯一标识
   * @param {Validation<TExtra>} validation 验证项对象
   */ const add = useCallback(
    (key: symbol, validation: Validation<unknown>) => {
      setValidations((prev) => {
        const next = new Map(prev);
        next.set(key, validation as Validation<TExtra>);
        return next;
      });
    },
    [],
  );

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
   * 获取所有验证项
   */
  const getAllValidations = useCallback((): Array<Validation<TExtra>> => {
    return Array.from(validations.values());
  }, [validations]);

  /**
   * 根据额外信息过滤验证项
   */
  const getValidationsByExtra = useCallback(
    <T extends TExtra>(
      predicate: (extra: TExtra) => extra is T,
    ): Array<Validation<T>> => {
      return Array.from(validations.values()).filter(
        (validation): validation is Validation<T> =>
          predicate(validation.extra),
      );
    },
    [validations],
  );

  /**
   * 计算并返回验证集合的状态
   * @returns {ValidationSet<TExtra>} 包含验证集合相关方法和状态的对象
   */ return useMemo(
    () =>
      ({
        add,
        remove,
        isValid,
        getAllValidations,
        getValidationsByExtra,
      }) satisfies ValidationSet<TExtra> as ValidationSet<TExtra>,
    [add, isValid, remove, getAllValidations, getValidationsByExtra],
  );
}
