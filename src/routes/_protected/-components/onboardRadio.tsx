import { Radio } from "@heroui/react";
export function OnboardingRadio({ description, title, value }: {
    title: string, description: string, value: string
}) {
    return (
        <Radio
            value={value}
            className=" border-2 border-default-200 hover:border-secondary p rounded-lg [&>span]:opacity-0 w-full max-w-full data-[selected=true]:border-secondary"
        >
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm text-default-500 font-medium">{description}</p>
        </Radio >
    );
};