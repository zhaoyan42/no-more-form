import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 字段状态
 */
export interface FieldStates {
  /** 字段是否被修改 */
  dirty: boolean;
  /** 字段是否被触摸/交互 */
  touched: boolean;
  /** 设置touched状态 */
  setTouched: (touched: boolean) => void;
}

/**
 * 使用字段状态
 * @template TField 字段值的类型
 * @param {TField} subject 字段当前值
 * @returns 包含字段状态的对象
 */
export function useFieldState<TField>(subject: TField) {
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  /** 字段的初始值 */
  const initialState = useRef(subject);

  /**
   * 监听字段值变化，更新dirty状态
   */
  useEffect(() => {
    if (initialState.current !== subject) {
      setDirty(true);
    }
  }, [setDirty, subject]);

  return useMemo(()=>({
    dirty,
    touched,
    setTouched,
  } satisfies FieldStates as FieldStates), [dirty, touched, setTouched]);
}
