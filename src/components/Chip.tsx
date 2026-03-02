import { extendVariants, Chip as HeroUiChip } from "@heroui/react";

export const Chip = extendVariants(HeroUiChip, {
    variants: {
        color: {
            default: {
                base: " bg-foreground text-background",
            },
            normal:{
                base: "bg-gray-200",
            }
        },
    },
    defaultVariants:{
        color: "default",
    }
});