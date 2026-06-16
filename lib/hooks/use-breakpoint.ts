"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind `lg` — desktop dashboard layout (1024px+). */
export function useIsLgUp(): boolean {
  const [isLgUp, setIsLgUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLgUp(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isLgUp;
}
