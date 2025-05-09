"use client";

import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Label } from "../label";
import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "../radio-group";

export const yesNoFieldSchema = z.object({
  id: z.string(),
  question: z.string(),
  value: z.boolean().optional(),
  yesLabel: z.string().default("Yes"),
  noLabel: z.string().default("No"),
});

type YesNoFieldProps = z.infer<typeof yesNoFieldSchema>;

export function YesNoField({
  id,
  question,
  value: initialValue,
  yesLabel = "Yes",
  noLabel = "No",
}: YesNoFieldProps) {
  const [state, setState] = useTamboComponentState(`yes-no-field-${id}`, {
    value: initialValue ?? null,
  });

  // Keep track of the last props update to prevent loops
  const lastPropsUpdate = useRef(JSON.stringify(initialValue));

  // Update state when props change
  useEffect(() => {
    const currentPropsString = JSON.stringify(initialValue);
    if (currentPropsString !== lastPropsUpdate.current) {
      lastPropsUpdate.current = currentPropsString;
      setState({ value: initialValue ?? null });
    }
  }, [initialValue]);

  // Use either state value or initial value as fallback
  const currentValue = state?.value ?? initialValue ?? null;

  const { setInputValue } = useTamboThread();

  const handleValueChange = (newValue: string) => {
    const boolValue = newValue === "true";
    setState({ value: boolValue });
    setInputValue(`I've made my selection.`);
  };

  return (
    <div className="space-y-2">
      <Label>{question}</Label>
      <ShadcnRadioGroup
        value={currentValue?.toString()}
        onValueChange={handleValueChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id={`${id}-yes`} />
          <Label htmlFor={`${id}-yes`} className="font-normal">
            {yesLabel}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id={`${id}-no`} />
          <Label htmlFor={`${id}-no`} className="font-normal">
            {noLabel}
          </Label>
        </div>
      </ShadcnRadioGroup>
    </div>
  );
}
