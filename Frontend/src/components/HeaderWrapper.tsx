"use client";

import React, { memo, useMemo } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";

const HeaderWrapper: React.FC = () => {
  try {
    const pathname = usePathname();

    const showHeaderPages = useMemo(
      () =>
        new Set([
          "/",
          "/checkout",
          "/Login",
          "/newSignup",
          "/Privacypolicy",
          "/Terms",
          "/Pricing",
        ]),
      []
    );

    const currentPath = pathname || "/";
    const showHeader = showHeaderPages.has(currentPath);

    if (!showHeader) return null;

    return <Header />;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in HeaderWrapper:", error);
    }
    return null;
  }
};

export default memo(HeaderWrapper);
