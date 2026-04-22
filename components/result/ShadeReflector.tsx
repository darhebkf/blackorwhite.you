"use client";

import { useEffect } from "react";
import {
  clearViewCookie,
  reflectFromCookie,
  reflectShade,
  setViewCookie,
} from "@/lib/browser";

type ShadeReflectorProps = {
  shade: number;
};

export function ShadeReflector({ shade }: ShadeReflectorProps) {
  useEffect(() => {
    setViewCookie(shade);
    reflectShade(shade);
  }, [shade]);

  useEffect(() => {
    return () => {
      clearViewCookie();
      void reflectFromCookie();
    };
  }, []);

  return null;
}
