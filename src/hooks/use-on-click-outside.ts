import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => { //A-1
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event); // kutsuu handleriä vain jos käyttäjä klikkaa elemetin ulkopuolelle
    };

    document.addEventListener("mousedown", listener); //A-1
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener); // touchstart = mobiilille!!
    };
  }, [ref, handler]); // päivitä vain jos ref tai handleri muuttuu 
};