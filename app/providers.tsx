"use client";
import { ReactNode } from "react";
import { StyleSheetManager } from "styled-components";

export default function Providers({ children }: { children: ReactNode }) {
  return <StyleSheetManager>{children}</StyleSheetManager>;
}
