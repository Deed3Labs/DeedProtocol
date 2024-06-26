import { useEffect } from "react";

type Key = "ctrl" | "shift" | "alt" | string;

export const useKeyboardShortcut = (keys: Key[], callback: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        keys.every(
          key =>
            (key === "ctrl" && event.ctrlKey) ||
            (key === "shift" && event.shiftKey) ||
            (key === "alt" && event.altKey) ||
            (typeof key === "string" && event.key?.toLowerCase() === key.toLowerCase()),
        )
      ) {
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};
