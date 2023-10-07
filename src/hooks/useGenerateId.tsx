import { useRef } from "react";

let idCounter = 0;
function generateId() {
  return `tmp_id_${idCounter++}`;
}

export const useGeneratedId = () => {
  const ref = useRef('');
  ref.current = ref.current || generateId();
  return ref.current;
};
