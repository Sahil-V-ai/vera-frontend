import { extendVariants, Card as HeroUiCard } from "@heroui/react";

export const Card = extendVariants(HeroUiCard, {
  variants: {
    color: {
      custom: {
        base: " border border-slate-200 shadow-none",
      },
      warning: {
        base: " border border-2 border-orange-300 bg-orange-50 shadow-none",
      },
      danger: {
        base: " border border-2 border-red-300 bg-red-50 shadow-none",
      },

    },
  },
  defaultVariants: {
    color: "custom",
  },
});