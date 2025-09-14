import { useCallback, useMemo, useRef, useState } from "react";
import type { Validation } from "./use-validation";

export interface ValidationSet<TExtra = unknown> {
  /** 验证集合的写入器 */
  writer: ValidationSetWriter<TExtra>;
  /** 验证集合 */
  result: ValidationSetResult<TExtra>;
}

/**
 * 验证集合
 */
export interface ValidationSetResult<TExtra = unknown> {
  /** 整个验证集合是否有效 */
  isValid: boolean;
  /** 获取所有验证项 */
  getAllValidations: () => Array<Validation<TExtra>>;
  /** 根据额外信息过滤验证项 */
  getValidationsByExtra?: <T extends TExtra>(
    predicate: (extra: TExtra) => extra is T,
  ) => Array<Validation<T>>;
}

export interface ValidationSetWriter<TExtra = unknown> {
  /** 添加验证项 */ add: (key: symbol, validation: Validation<TExtra>) => void;
  /** 删除验证项 */ remove: (key: symbol) => void;
}

/**
 * 使用验证集合
 * @returns 包含验证集合相关方法和状态的对象
 */
export function ValidationSet<TExtra = unknown>(): ValidationSet<TExtra> {
  const [validations, setValidations] = useState<
    Map<symbol, Validation<TExtra>>
  >(() => new Map());

  const writerRef = useRef<ValidationSetWriter<TExtra>>({
    add: (key: symbol, validation: Validation<TExtra>) => {
      setValidations((prev) => {
        const next = new Map(prev);
        next.set(key, validation);
        return next;
      });
    },
    remove: (key: symbol) => {
      setValidations((prev) => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
    },
  });

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
   * @returns { writer: ValidationSetWriter<TExtra>, validationSet: ValidationSet<TExtra> }
   */
  return useMemo(
    () => ({
      writer: writerRef.current,
      result: {
        isValid,
        getAllValidations,
        getValidationsByExtra,
      },
    }),
    [isValid, getAllValidations, getValidationsByExtra],
  );
}
