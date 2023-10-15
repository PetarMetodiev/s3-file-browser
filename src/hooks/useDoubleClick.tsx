import { MouseEvent, MouseEventHandler, useCallback, useRef } from "react";

export const useDoubleClick = <T,>({
  onClick,
  onDoubleClick,
}: {
  onDoubleClick?: MouseEventHandler<T>;
  onClick?: MouseEventHandler<T>;
}) => {
  const timeout = 200;
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
      if (onClick && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          onClick(event);
        }, timeout);
      }
      if (event.detail % 2 === 0) {
        onDoubleClick?.(event);
      }
    },
    [onClick, onDoubleClick]
  );
};
