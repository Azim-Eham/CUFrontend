import { useEffect } from "react";

/**
 * Sets the document title. Resets to the default when the component unmounts.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — CUPC` : "CUPC — CU Students & Alumni Platform";
    return () => {
      document.title = prev;
    };
  }, [title]);
}
