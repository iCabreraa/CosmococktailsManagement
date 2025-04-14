import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef(null);

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, listenCapturing); // mousedown: correct the problem opening the modal window

      return () => {
        document.removeEventListener("click", handleClick, listenCapturing);
      };
    },
    [handler]
  );

  return ref;
}

export default useOutsideClick;
