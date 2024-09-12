import { useState } from "react";

export function useGroupStates() {
  const [groupTouched, setGroupTouched] = useState(false);

  return {
    groupTouched,
    setGroupTouched,
  };
}
