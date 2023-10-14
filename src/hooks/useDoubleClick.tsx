import { MouseEvent, MouseEventHandler, useCallback, useRef } from "react";

export const useDoubleClick = <T,>({
  doubleClick,
  click,
  timeout = 200,
}: {
  doubleClick: MouseEventHandler<T>;
  click: MouseEventHandler<T>;
  timeout: number;
}) => {
  const clickTimeout = useRef<ReturnType<typeof setTimeout>>();

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = undefined;
    }
  };

  return useCallback(
    (event: MouseEvent<T>) => {
      clearClickTimeout();
      if (click && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          click(event);
        }, timeout);
      }
      if (event.detail % 2 === 0) {
        doubleClick(event);
      }
    },
    [click, doubleClick]
  );
};
