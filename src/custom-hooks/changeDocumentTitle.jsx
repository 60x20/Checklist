import { useLayoutEffect } from "react";

const originalTitle = document.title;

export default function changeDocumentTitle(mainTitle = originalTitle, subtitle = '') {
  // layout effect preferred to decrease the delay
  useLayoutEffect(() => { // when mounts or subtitle changes, use the titles
    document.title = subtitle ? [mainTitle, subtitle].join(' - ') : mainTitle;
  }, [subtitle]);
  useLayoutEffect(() => { // when unmounts, revert back to the original
    return () => document.title = originalTitle;
  }, []);
}
